(function() {

	/**
	 * 
	 * @param {ServerPlayer} player 
	 */
	function handleActiveAbilityKeyPress(player) {
		let race = PlayerRaceHelper.getRace(player);
		switch (race) {
			case Races.CHIMERA:
				ChimeraPrimaryAbility.onPress(player);
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
				handleActiveAbilityKeyPress(player);
				break;
			default:
				break;
		}
	});
})();