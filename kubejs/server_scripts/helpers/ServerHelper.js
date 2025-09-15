const ServerHelper = {};

/**
 * 
 * @param {MinecraftServer} server 
 */
ServerHelper.numberOfNonOperators = function(server) {
	return server.playerList.players
		.stream()
		.filter(p => !PlayerHelper.isOperator(p))
		.count();
}