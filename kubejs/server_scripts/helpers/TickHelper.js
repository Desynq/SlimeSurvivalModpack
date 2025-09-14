const TickHelper = {};


// todo: make this get actual server tick rate
/**
 * 
 * @param {MinecraftServer} server 
 */
TickHelper.getTickRate = function(server) {
	return 20;
}

/**
 * 
 * @param {MinecraftServer} server 
 * @returns 
 */
TickHelper.getGameTime = function(server) {
	return server.overworld().levelData.getGameTime();
}