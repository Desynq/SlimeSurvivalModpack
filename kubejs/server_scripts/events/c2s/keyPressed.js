(function() {

	/**
	 * 
	 * @param {ServerPlayer} player 
	 */
	function handleActiveAbilityKeyPress(player) {
		let raceWrapper = PlayerRaceHelper.getRaceWrapper(player);
		if (raceWrapper instanceof ChimeraPlayer) {
			SanguineConvenantAbility.onPress(raceWrapper);
		}
		else if (raceWrapper instanceof FarlanderPlayer) {
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
				handleActiveAbilityKeyPress(player);
				break;
			default:
				break;
		}
	});
})();