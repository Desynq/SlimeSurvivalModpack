(function() {

	/**
	 * 
	 * @param {ServerPlayer} player 
	 */
	function handlePrimaryAbilityKeyPress(player) {
		let raceWrapper = PlayerRaceHelper.getRaceWrapper(player);
		if (raceWrapper instanceof ChimeraPlayer) {
			SanguineConvenantAbility.onPress(raceWrapper);
		}
		else if (raceWrapper instanceof FarlanderPlayer) {
			QuantumRelativityAbility.onPress(player);
		}
	}

	/**
	 * 
	 * @param {ServerPlayer} player 
	 */
	function handleSecondaryAbilityKeyPress(player) {
		let raceWrapper = PlayerRaceHelper.getRaceWrapper(player);
		if (raceWrapper instanceof FarlanderPlayer) {
			HeatDeathAbility.onPress(player);
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
			default:
				break;
		}
	});
})();