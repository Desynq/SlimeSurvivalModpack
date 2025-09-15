
/**
 * 
 * @param {MinecraftServer} server 
 */
function isMoreThanOneNonOperator(server) {
	return ServerHelper.numberOfNonOperators(server) > 1;
}

// TODO: Add savings system for weather and seasons
const DAYLIGHT_SAVINGS_RULES = ["doDaylightCycle", "doWeatherCycle", "doSeasonCycle"];

PlayerEvents.loggedIn(event => {
	const server = event.server;

	if (isMoreThanOneNonOperator(server)) {
		return;
	}

	const daylightRule = server.gameRules.getRule($GameRules.RULE_DAYLIGHT);
	if (!daylightRule.get()) {
		daylightRule.set(true, server);
	}
});

PlayerEvents.loggedOut(event => {
	const server = event.server;

	if (isMoreThanOneNonOperator(server)) {
		return;
	}

	const daylightRule = server.gameRules.getRule($GameRules.RULE_DAYLIGHT);
	if (daylightRule.get()) {
		daylightRule.set(false, server);
	}
});