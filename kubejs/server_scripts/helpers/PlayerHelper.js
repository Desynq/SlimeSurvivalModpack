const PlayerHelper = {}



/**
 * 
 * @param {Player} player 
 */
PlayerHelper.isSurvivalLike = function(player) {
	return !player.creative && !player.spectator;
}

/**
 * @param {Player} player
 */
PlayerHelper.isOperator = function(player) {
	return player.permissionLevel >= 2;
}



/**
 * @param {MinecraftServer} server
 * @param {import("java.util.UUID").$UUID$$Original | null} uuid
 */
PlayerHelper.isOnWhitelist = function(server, uuid) {
	return server
		.getPlayerList()
		.getWhiteList()
		.getEntries()
		.stream()
		.anyMatch(entry => entry
			.getUser()
			.getId()
			.equals(uuid)
		);
}