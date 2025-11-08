


namespace AdventureHandler {

	PlayerEvents.tick(event => {
		const player = event.player as ServerPlayer_;

		const hasAdventureEffect = player.hasEffect($SlimeSurvivalMobEffects.ADVENTURE.getDelegate());

		if (hasAdventureEffect && PlayerHelper.isSurvival(player)) {
			player.setGameMode("adventure");
		}
		else if (!hasAdventureEffect && PlayerHelper.isAdventure(player)) {
			player.setGameMode("survival");
		}
	});
}