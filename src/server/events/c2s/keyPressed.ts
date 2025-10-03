


namespace KeyPressedPacketListener {

	function handlePrimaryAbilityKeyPress(player: ServerPlayer_) {
		let raceWrapper = PlayerRaceHelper.getRaceWrapper(player);
		if (raceWrapper instanceof ChimeraPlayer) {
			SanguineConvenantAbility.onPress(raceWrapper);
		}
		else if (raceWrapper instanceof FarlanderPlayer) {
			QuantumRelativity.onPress(player);
		}
	}

	function handleSecondaryAbilityKeyPress(player: ServerPlayer_) {
		let raceWrapper = PlayerRaceHelper.getRaceWrapper(player);
		if (raceWrapper instanceof FarlanderPlayer) {
			HeatDeathAbility.onPress(player);
		}
	}

	function handleTertiaryAbilityKeyPress(player: ServerPlayer_) {
		switch (PlayerRaceHelper.getRace(player)) {
			case Races.SLUDGE:
				SludgeCytoplasm.CytoplasmDisabler.onPress(player);
				break;
			default:
				break;
		}
	}

	NetworkEvents.dataReceived("KeyPressed", event => {
		let player = event.player;
		if (!(player instanceof $ServerPlayer)) {
			return;
		}
		let key = event.data.getString("key");

		switch (key) {
			case "key.slimesurvival.primary_ability":
				handlePrimaryAbilityKeyPress(player);
				break;
			case "key.slimesurvival.secondary_ability":
				handleSecondaryAbilityKeyPress(player);
				break;
			case "key.slimesurvival.tertiary_ability":
				handleTertiaryAbilityKeyPress(player);
				break;
			default:
				break;
		}
	});
}