const PlayerHelper = {}



/**
 * 
 * @param {$ServerPlayer_} player 
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