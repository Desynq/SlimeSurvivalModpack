


PlayerEvents.tick(event => {
	if (!(event.player instanceof $ServerPlayer)) {
		return;
	}

	let playerRaceWrapper = PlayerRaceHelper.getRaceWrapper(event.player);
	if (playerRaceWrapper instanceof ChimeraPlayer) {
		new ChimeraTick(playerRaceWrapper);
		SanguineConvenantAbility.onTick(playerRaceWrapper);
	}
	else if (playerRaceWrapper instanceof FarlanderPlayer) {
		QuantumRelativityAbility.onTick(event.player);
		HeatDeathAbility.onTick(event.player);
	}
});