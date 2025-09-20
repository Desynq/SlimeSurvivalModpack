


PlayerEvents.tick(event => {
	if (!(event.player instanceof $ServerPlayer)) {
		return;
	}

	let racePlayer = PlayerRaceHelper.getRaceWrapper(event.player);
	if (racePlayer instanceof ChimeraPlayer) {
		new ChimeraTick(racePlayer);
		SanguineConvenantAbility.onTick(racePlayer);
	}
});