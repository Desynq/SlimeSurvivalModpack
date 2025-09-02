ServerEvents.tick(event => {
	const server = event.server;
	const overworld = server.getLevel("minecraft:overworld");

	if (server.gameRules.getBoolean($GameRules.RULE_DAYLIGHT) && overworld.getDayTime() % 24000 == 1) {
		everyDawn();
	}



	let percentageLost;

	function everyDawn() {
		percentageLost = biasedRandom(0, 0.5, 20)
		StockManager.diminishStocks(server, percentageLost); // half lost every irl day
		server.players !== null && server.players.toArray().forEach(player => broadcastDawn(player));
	}

	/**
	 * @param {$Player_} player
	 */
	function broadcastDawn(player) {
		player.tell(ConcatString(
			"A new dawn rises.\n",
			`All sold items have diminished by ${(percentageLost * 100).toFixed(2)}%.`
		));
	}
});