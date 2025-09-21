/** @type {typeof import("net.neoforged.neoforge.event.entity.player.CanPlayerSleepEvent").$CanPlayerSleepEvent } */
let $CanPlayerSleepEvent = Java.loadClass("net.neoforged.neoforge.event.entity.player.CanPlayerSleepEvent")

NativeEvents.onEvent($CanPlayerSleepEvent, event => {
	const server = event.entity.server;
	const numPlayers = server.getPlayerCount();
	if (numPlayers <= 0) {
		return;
	}
	const numSurvivors = ServerHelper.numberOfNonOperators(server);
	const numNeeded = Math.ceil(numSurvivors / 2);
	const percentage = numNeeded / numPlayers;
	const percentageInt = Math.floor(percentage * 100);

	const rule = server.getGameRules().getRule($GameRules.RULE_PLAYERS_SLEEPING_PERCENTAGE);
	rule.set(percentageInt, server);
});