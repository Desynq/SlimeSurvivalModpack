

namespace Sculker.Events {

	NativeEvents.onEvent($LivingDamageEvent$Pre, event => {
		try {
			const victim = event.entity;
			if (isSculker(victim)) {
				sculkerBeforeHurt(victim, event);
			}

			const attacker = event.source.actual as Entity_ | null;
			if (isSculker(attacker)) {
				attackedBySculker(victim, attacker, event);
			}
		}
		catch (e) {
			console.error(e);
		}
	});

	NativeEvents.onEvent($VanillaGameEvent, event => {
		try {
			const entity = event.cause as Entity_ | null;
			const flag = entity instanceof $LivingEntity;
			if (!flag) return;

			const gameEvent = event.vanillaEvent;
			if (ignoreSound(entity, gameEvent)) return;

			const players = event.level.players.toArray() as ServerPlayer_[];
			for (const player of players) {
				Sculker.Pinged.tryPing(entity, player, event.eventPosition, gameEvent);
			}
		}
		catch (e) {
			console.error(e);
		}
	});

	PlayerEvents.tick(event => {
		const player = event.player as ServerPlayer_;

		Sculker.Rooting.tick(player);
	});


	function ignoreSound(entity: LivingEntity_, gameEvent: GameEvent_): boolean {
		const id = gameEvent.getRegisteredName();

		switch (id) {
			case "minecraft:projectile_shoot":
				return false;
		}

		if (entity.steppingCarefully && gameEvent.isTag("minecraft:ignore_vibrations_sneaking")) {
			return true;
		}

		return false;
	}




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