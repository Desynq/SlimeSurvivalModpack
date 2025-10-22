


namespace KeyPressedPacketListener {

	function handlePrimaryAbilityKeyPress(player: ServerPlayer_) {
		switch (PlayerRaceHelper.getRace(player)) {
			case Races.CHIMERA:
				const raceWrapper = PlayerRaceHelper.getRaceWrapper(player) as ChimeraPlayer;
				SanguineConvenantAbility.onPress(raceWrapper);
				break;
			case Races.FARLANDER:
				QuantumRelativity.onPress(player);
				break;
			case Races.DUNESTRIDER:
				FocusAbility.onPress(player);
		}
	}

	function handleSecondaryAbilityKeyPress(player: ServerPlayer_) {
		switch (PlayerRaceHelper.getRace(player)) {
			case Races.FARLANDER:
				HeatDeathAbility.onPress(player);
				break;
		}
	}

	function handleTertiaryAbilityKeyPress(player: ServerPlayer_) {
		switch (PlayerRaceHelper.getRace(player)) {
			case Races.SLUDGE:
				SludgeCytoplasm.CytoplasmDisabler.onPress(player);
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