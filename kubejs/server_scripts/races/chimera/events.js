PlayerEvents.tick(event => {
	if (!(event.player instanceof $ServerPlayer && PlayerRaceHelper.isRace(event.player, Races.CHIMERA))) {
		return;
	}
	new ChimeraPlayer(event.player).tick();
});