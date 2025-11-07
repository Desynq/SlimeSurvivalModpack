


PlayerEvents.tick(event => {
	const player = event.player as ServerPlayer_;

	const playerRaceWrapper = RaceHelper.getRaceWrapper(player);
	if (playerRaceWrapper instanceof ChimeraPlayer) {
		new ChimeraTick(playerRaceWrapper);
		SanguineConvenantAbility.onTick(playerRaceWrapper);
	}

	const race = RaceHelper.getRace(player);
	switch (race) {
		case Races.FARLANDER:
			QuantumRelativity.onTick(player);
			HeatDeathAbility.onTick(player);
			break;
		case Races.DUNESTRIDER:
			FocusAbility.onTick(player);
	}
});