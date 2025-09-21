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
 * @returns 
 */
TickHelper.getTimestamp = function(entity, id) {
	return entity.persistentData.getLong(id);
}

/**
 * @param {Entity} entity 
 * @param {string} id 
 * @returns {long} Time that has passed since the timestamp was last set or the current game time if the timestamp has not been updated.
 */
TickHelper.getTimestampDiff = function(entity, id) {
	return TickHelper.getGameTime(entity.server) - TickHelper.getTimestamp(entity, id);
}

/**
 * 
 * @param {Entity} entity 
 * @param {string} id 
 * @param {long} interval 
 */
TickHelper.hasTimestampPassed = function(entity, id, interval) {
	return TickHelper.getTimestampDiff(entity, id) >= interval;
}

/**
 * Sets the timestamp to the current game time
 * @param {Entity} entity 
 * @param {string} id 
 */
TickHelper.forceUpdateTimestamp = function(entity, id) {
	entity.persistentData.putLong(id, TickHelper.getGameTime(entity.server));
}

/**
 * Sets timestamp to -Long.MAX_VALUE so that hasTimestampPassed() always returns true
 * @param {Entity} entity 
 * @param {string} id 
 */
TickHelper.resetTimestamp = function(entity, id) {
	entity.persistentData.putLong(id, $Long.MIN_VALUE)
}

/**
 * Updates the timestamp to current game time if the timestamp has not been last updated since the specified interval
 * @param {Entity} entity 
 * @param {string} id
 * @param {long} interval
 * @returns {boolean} true if timestamp was successfully updated after interval passed
 */
TickHelper.updateTimestamp = function(entity, id, interval) {
	if (TickHelper.hasTimestampPassed(entity, id, interval)) {
		TickHelper.forceUpdateTimestamp(entity, id);
		return true;
	}
	return false;
}



/**
 * @param {MinecraftServer} server
 * @param {integer} ticks 
 * @returns 
 */
TickHelper.toSeconds = function(server, ticks) {
	return (ticks / TickHelper.getTickRate(server)).toFixed(1);
}