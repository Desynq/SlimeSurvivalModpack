PlayerEvents.loggedIn(event => {
	const server = event.server;
	const player = event.player;

	if (player.hasPermissions(2)) {
		return;
	}

	const daylightRule = server.gameRules.getRule($GameRules.RULE_DAYLIGHT);
	if (!daylightRule.get()) {
		daylightRule.set(true, server);
	}
});

PlayerEvents.loggedOut(event => {
	const server = event.server;
	const player = event.player;

	if (player.hasPermissions(2)) {
		return;
	}

	const daylightRule = server.gameRules.getRule($GameRules.RULE_DAYLIGHT);
	if (server.playerList.players.size() <= 1 && daylightRule.get()) {
		daylightRule.set(false, server);
	}
});