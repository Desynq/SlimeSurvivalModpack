PlayerEvents.tick(event => {
	const player = event.player;

	if (player.stats.timeSinceDeath == 1) {
		restoreHunger();
	}
	saveHunger();



	function restoreHunger() {
		player.foodLevel = player.persistentData.getFloat('food_level_last_tick');
		player.saturation = player.persistentData.getFloat('saturation_last_tick');
	}

	function saveHunger() {
		player.persistentData.putFloat('food_level_last_tick', player.foodLevel);
		player.persistentData.putFloat('saturation_last_tick', player.saturation);
	}
});