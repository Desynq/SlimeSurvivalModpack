


PlayerEvents.tick(event => {
	const player = event.player as ServerPlayer_;

	const playerRaceWrapper = PlayerRaceHelper.getRaceWrapper(player);
	if (playerRaceWrapper instanceof ChimeraPlayer) {
		new ChimeraTick(playerRaceWrapper);
		SanguineConvenantAbility.onTick(playerRaceWrapper);
	}

	const race = PlayerRaceHelper.getRace(player);
	switch (race) {
		case Races.FARLANDER:
			QuantumRelativity.onTick(player);
			HeatDeathAbility.onTick(player);
			break;
		case Races.DUNESTRIDER:
			FocusAbility.onTick(player);
	}
});