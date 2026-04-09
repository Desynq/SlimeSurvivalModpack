// priority: 1

namespace Sculker.Pinged {

	const pingEffect = MobEffectApplicator.of("slimesurvival:pinged")
		.withVisibility(false, false);

	export function getDuration(sculker: ServerPlayer_): integer {
		const skill = SkillHelper.getHighestTier(sculker, SculkerSkills.ECHO_SKILLS);
		if (skill === null) {
			return 20;
		}

		return skill.data.ticks;
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

	export function tryPing(victim: LivingEntity_, player: ServerPlayer_, origin: Vec3_, gameEvent: GameEvent_): void {
		if (victim === player) return;
		if (SculkerSkills.ECHOLOCATION.isLockedFor(player)) return;

		const dist = player.distanceToEntity(victim);
		const maxDist = Pinged.getMaxDist(player, victim, gameEvent);
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

		const tagged: ServerPlayer_[] = [];
		for (const p of player.level.players as ServerPlayer_[]) {
			if (p === victim || (p.shiftKeyDown && SculkerSkills.ECHOLOCATION.isUnlockedFor(p))) {
				p.tags.add("ping_visible");
				tagged.push(p);
			}
		}
		CommandHelper.runCommandSilent(player.level,
			`particle minecraft:vibration${JSON.stringify(vibrationConfig)} ${origin.x()} ${origin.y()} ${origin.z()} 0.1 0.1 0.1 0 1 force @a[tag=ping_visible]`
		);
		for (const p of tagged) {
			p.tags.remove("ping_visible");
		}

		delay(player.server, pingDelay, () => {
			pingEffect.withDuration(duration).apply(victim, player);
		});
	}
}