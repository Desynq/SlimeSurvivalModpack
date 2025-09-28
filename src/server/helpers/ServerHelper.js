const ServerHelper = {};

/**
 * 
 * @param {MinecraftServer_} server 
 */
ServerHelper.numberOfNonOperators = function(server) {
	return server.playerList.players
		.stream()
		.filter(p => !PlayerHelper.isOperator(p))
		.count();
}