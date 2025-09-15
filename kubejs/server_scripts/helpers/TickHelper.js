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


/**
 * 
 * @param {Entity} entity 
 * @param {string} id
 * @param {long} interval
 * @returns {boolean} true if timestamp was successfully updated after interval passed
 */
TickHelper.timestamp = function(entity, id, interval) {
	const currentTimestamp = TickHelper.getGameTime(entity.server);
	const oldTimestamp = entity.persistentData.getLong(id);
	if (currentTimestamp - oldTimestamp < interval) {
		return false;
	}
	else {
		entity.persistentData.putLong(id, currentTimestamp);
		return true;
	}
}