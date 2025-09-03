const PlayerHelper = {}



/**
 * 
 * @param {$ServerPlayer_} player 
 */
PlayerHelper.isSurvivalLike = function (player) {
	return !player.creative && !player.spectator;
}