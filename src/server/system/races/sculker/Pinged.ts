// priority: 1

namespace Sculker.Pinged {

	const pingEffect = MobEffectApplicator.of("slimesurvival:pinged")
		.withVisibility(false, false);

	export function getDuration(sculker: ServerPlayer_): integer {
		if (SculkerSkills.ECHO_1.isUnlockedFor(sculker)) {
			return 40;
		}

		return 20;
	}

	export function getMaxDist(sculker: ServerPlayer_, entity: LivingEntity_, gameEvent: GameEvent_): number {
		const id = gameEvent.getRegisteredName();

		if (entity instanceof $ServerPlayer) {
			switch (id) {
				case "minecraft:projectile_shoot": {
					const stack = entity.mainHandItem;
					if (stack === null) break;
					if (stack.id !== "tacz:modern_kinetic_gun") break;

					const suppressed = GunHelper.isSuppressed(stack);
					if (suppressed) return 32;
					return 256; // unsuppressed gun
				}
			}
		}

		return 32;
	}

	/**
	 * Default delay is 20m/s with a minimum response of 250ms
	 */
	export function getDelay(sculker: ServerPlayer_, distance: number): number {
		const minDelay = 5;
		const blocksPerSecond = 20;
		const ticksPerSecond = 20;

		const delayTicks = (distance / blocksPerSecond) * ticksPerSecond;

		return Math.max(minDelay, delayTicks);
	}

	export function tryPing(entity: LivingEntity_, player: ServerPlayer_, origin: Vec3_, gameEvent: GameEvent_): void {
		if (entity === player) return;
		if (SculkerSkills.ECHOLOCATION.isLockedFor(player)) return;

		const dist = player.distanceToEntity(entity);
		const maxDist = Pinged.getMaxDist(player, entity, gameEvent);
		if (dist > maxDist) return;

		const duration = Pinged.getDuration(player);

		const originDist = origin.distanceTo(player.position() as any);
		const pingDelay = Pinged.getDelay(player, originDist);


		const vibrationConfig = {
			destination: {
				type: "block",
				pos: [player.x, player.eyeY, player.z]
			},
			arrival_in_ticks: pingDelay
		};
		CommandHelper.runCommandSilent(player.level,
			`particle minecraft:vibration${JSON.stringify(vibrationConfig)} ${origin.x()} ${origin.y()} ${origin.z()} 0.1 0.1 0.1 0 1 force @a[distance=0..]`
		);

		delay(player.server, pingDelay, () => {
			pingEffect.withDuration(duration).apply(entity, player);
		});
	}
}