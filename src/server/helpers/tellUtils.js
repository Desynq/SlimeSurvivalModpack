/**
 * 
 * @param {unknown} player 
 * @returns {player is ServerPlayer_}
 */
function canReceiveOperatorMessages(player) {
	return player instanceof $ServerPlayer && player.permissionLevel >= 2;
}

/**
 * 
 * @param {MinecraftServer_} server 
 * @param {import("net.minecraft.network.chat.Component").$Component$$Type} chatComponent 
 */
function tellOperators(server, chatComponent) {
	server.getPlayerList().getPlayers().forEach(player => {
		if (canReceiveOperatorMessages(player)) {
			player.tell(chatComponent);
		}
	});
}

/**
 * 
 * @param {MinecraftServer_} server 
 * @param {*} error 
 */
function tellError(server, error) {
	tellOperators(server, `${error.message} ${error.stack}`);
}

/**
 * 
 * @param {unknown} player 
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