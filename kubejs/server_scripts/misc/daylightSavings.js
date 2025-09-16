
/**
 * 
 * @param {MinecraftServer} server 
 */
function isMoreThanOneNonOperator(server) {
	return ServerHelper.numberOfNonOperators(server) > 1;
}

/**
 * 
 * @param {MinecraftServer} server 
 * @param {boolean} bool 
 */
function setCycleRules(server, bool) {
	const daylightRule = server.gameRules.getRule($GameRules.RULE_DAYLIGHT);
	const weatherRule = server.gameRules.getRule($GameRules.RULE_WEATHER_CYCLE);
	/** @type {import("net.minecraft.world.level.GameRules$BooleanValue").$GameRules$BooleanValue$$Original} */
	const seasonRule = server.gameRules.getRule($SereneSeasonsGameRules.RULE_DOSEASONCYCLE);

	[daylightRule, weatherRule, seasonRule].forEach(rule => {
		rule.set(bool, server);
	});
}

PlayerEvents.loggedIn(event => {
	const server = event.server;

	if (PlayerHelper.isOperator(event.player)) {
		return;
	}

	setCycleRules(server, true);
});

PlayerEvents.loggedOut(event => {
	const server = event.server;

	if (isMoreThanOneNonOperator(server)) {
		return;
	}

	setCycleRules(server, false);
});