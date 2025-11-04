

PlayerEvents.tick(event => {
	const player = event.player;

	if (player.stats.timeSinceDeath == 1) {
		restoreHunger();
	}
	saveHunger();


	function restoreHunger() {
		const data = player.persistentData;
		if (data.contains("food_level_last_tick", $Tag.TAG_FLOAT)) {
			player.foodLevel = data.getFloat("food_level_last_tick");
		}

		if (data.contains("saturation_last_tick", $Tag.TAG_FLOAT)) {
			player.saturation = data.getFloat("saturation_last_tick");
		}
	}

	function saveHunger() {
		player.persistentData.putFloat('food_level_last_tick', player.foodLevel);
		player.persistentData.putFloat('saturation_last_tick', player.saturation);
	}
});