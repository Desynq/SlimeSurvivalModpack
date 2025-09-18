/**
 * 
 * @param {ServerPlayer} player 
 */
function canReceiveOperatorMessages(player) {
	return player.permissionLevel >= 2;
}

/**
 * 
 * @param {MinecraftServer} server 
 * @param {import("net.minecraft.network.chat.Component").$Component$$Type} chatComponent 
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
 * @param {MinecraftServer} server 
 * @param {*} error 
 */
function tellError(server, error) {
	tellOperators(server, `${error.message} ${error.stack}`);
}

/**
 * 
 * @param {ServerPlayer} player 
 * @param {import("net.minecraft.network.chat.Component").$Component$$Type} chatComponent 
 */
function tellIfOperator(player, chatComponent) {
	if (canReceiveOperatorMessages(player)) {
		player.tell(chatComponent);
	}
}

/**
 * 
 * @param {object} player 
 * @param {import("net.minecraft.network.chat.Component").$Component$$Type} text
 */
function debugTell(player, text) {
	if (player instanceof $Player && player.tags.contains("debug")) {
		player.tell(text);
	}
}