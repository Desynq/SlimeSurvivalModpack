
namespace SculkerEvents {

	NativeEvents.onEvent($LivingDamageEvent$Pre, event => {
		const entity = event.entity;
		if (entity instanceof $ServerPlayer && PlayerRaceHelper.isRace(entity, Races.SCULKER)) {
			sculkerBeforeHurt(entity, event);
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
			if (!PlayerRaceHelper.isRace(player, Races.SCULKER)) continue;

			const distance = player.distanceToEntity(entity);
			if (distance > 64) continue;

			const duration = 20;

			LivingEntityHelper.addEffect(entity, "slimesurvival:pinged", duration, 0, false, false, false, player);
		}
	});

	function sculkerBeforeHurt(player: ServerPlayer_, event: LivingDamageEvent$Pre_): void {
		if (SculkerSkills.MYCELIC.isUnlockedFor(player) && !player.onGround()) {
			event.newDamage *= 2.0;
		}
	}
}