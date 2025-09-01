/**
 * 
 * @param {$ServerPlayer_} player 
 */
function canReceiveOperatorMessages(player) {
	return player.permissionLevel >= 2;
}

/**
 * 
 * @param {$MinecraftServer_} server 
 * @param {$Component$$Type} chatComponent 
 */
function tellOperators(server, chatComponent) {
	server.playerList.players.forEach(player => {
		if (canReceiveOperatorMessages(player)) {
			player.tell(chatComponent);
		}
	});
}

/**
 * 
 * @param {$ServerPlayer_} player 
 * @param {$Component$$Type} chatComponent 
 */
function tellIfOperator(player, chatComponent) {
	if (canReceiveOperatorMessages(player)) {
		player.tell(chatComponent);
	}
}