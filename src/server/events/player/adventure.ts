


namespace AdventureHandler {

	NativeEvents.onEvent($MobEffectEvent$Remove, event => {
		const entity = event.entity;
		const effect = event.effect;
		const flag = entity instanceof $ServerPlayer && effect.is("slimesurvival:adventure");
		if (!flag) return;

		const player = entity;
		if (!PlayerHelper.isAdventure(player)) return;

		player.setGameMode("survival");
	});

	NativeEvents.onEvent($MobEffectEvent$Expired, event => {
		const entity = event.entity;
		const effect = event.effectInstance;
		const flag = entity instanceof $ServerPlayer && effect.is($SlimeSurvivalMobEffects.ADVENTURE.getDelegate());
		if (!flag) return;

		const player = entity;
		if (!PlayerHelper.isAdventure(player)) return;

		player.setGameMode("survival");
	});

	NativeEvents.onEvent($MobEffectEvent$Added, event => {
		const entity = event.entity;
		const effect = event.effectInstance;
		const flag = entity instanceof $ServerPlayer && effect.is($SlimeSurvivalMobEffects.ADVENTURE.getDelegate());
		if (!flag) return;

		const player = entity;
		if (!PlayerHelper.isSurvival(player)) return;

		player.setGameMode("adventure");
	});
}