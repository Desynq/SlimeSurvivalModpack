
namespace Sculker.Events {

	NativeEvents.onEvent($LivingDamageEvent$Pre, event => {
		const victim = event.entity;
		if (isSculker(victim)) {
			sculkerBeforeHurt(victim, event);
		}

		const attacker = event.source.actual as Entity_ | null;
		if (isSculker(attacker)) {
			attackedBySculker(victim, attacker, event);
		}
	});

	NativeEvents.onEvent($VanillaGameEvent, event => {
		const entity = event.cause as Entity_ | null;
		const flag = entity instanceof $LivingEntity;
		if (!flag) return;

		const gameEvent = event.vanillaEvent;
		if (entity.steppingCarefully && gameEvent.isTag("minecraft:ignore_vibrations_sneaking")) return;

		const players = event.level.players.toArray() as ServerPlayer_[];
		for (const player of players) {
			if (entity === player) continue;
			if (!RaceHelper.isRace(player, Races.SCULKER)) continue;

			const distance = player.distanceToEntity(entity);
			if (distance > 64) continue;

			const duration = 20;

			LivingEntityHelper.addEffect(entity, "slimesurvival:pinged", duration, 0, false, false, false, player);
		}
	});

	function isSculker(entity: unknown): entity is ServerPlayer_ {
		return entity instanceof $ServerPlayer && RaceHelper.isRace(entity, Races.SCULKER);
	}

	function sculkerBeforeHurt(player: ServerPlayer_, event: LivingDamageEvent$Pre_): void {
		if (!player.onGround() && SculkerSkills.MYCELIC.isUnlockedFor(player)) {
			event.newDamage *= 2.0;
		}
	}

	function attackedBySculker(victim: Entity_, attacker: ServerPlayer_, event: LivingDamageEvent$Pre_): void {
		if (victim.onGround() && SculkerSkills.APPRESSORIUM.isUnlockedFor(attacker)) {
			event.newDamage *= 2.0;
		}
		else {
		}
	}
}