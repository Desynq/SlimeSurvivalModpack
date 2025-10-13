const TickHelper = {};


// todo: make this get actual server tick rate
/**
 * 
 * @param {MinecraftServer_} server 
 */
TickHelper.getDefaultTickRate = function(server) {
	return 20;
}

TickHelper.defaultTickRate = 20;

/**
 * 
 * @param {MinecraftServer_} server 
 * @param {integer} newTickRate 
 */
TickHelper.setTickRate = function(server, newTickRate) {
	CommandHelper.runCommandSilent(server, `tick rate ${newTickRate}`);
}

/**
 * 
 * @param {MinecraftServer_} server 
 */
TickHelper.resetTickRate = function(server) {
	CommandHelper.runCommandSilent(server, `tick rate ${TickHelper.getDefaultTickRate(server)}`);
}

/**
 * 
 * @param {MinecraftServer_} server 
 * @returns 
 */
TickHelper.getGameTime = function(server) {
	return server.overworld().levelData.getGameTime();
}



/**
 * 
 * @param {Entity_} entity 
 * @param {string} id 
 * @returns 0 if timestamp has not been set for entity
 */
TickHelper.getTimestamp = function(entity, id) {
	return entity.persistentData.getLong(id);
}

/**
 * 
 * @param {Entity_} entity 
 * @param {string} id 
 */
TickHelper.hasTimestamp = function(entity, id) {
	return entity.persistentData.contains(id);
}

/**
 * @param {Entity_} entity 
 * @param {string} id 
 * @returns {long} Time that has passed since the timestamp was last set or the current game time if the timestamp has not been updated.
 */
TickHelper.getTimestampDiff = function(entity, id) {
	return TickHelper.getGameTime(entity.server) - TickHelper.getTimestamp(entity, id);
}

/**
 * 
 * @param {Entity_} entity 
 * @param {string} id 
 * @param {long} interval 
 */
TickHelper.hasTimestampElapsed = function(entity, id, interval) {
	return TickHelper.getTimestampDiff(entity, id) >= interval;
}

/**
 * 
 * @param {Entity_} entity 
 * @param {string} id 
 * @param {long} interval 
 */
TickHelper.getTimestampRemaining = function(entity, id, interval) {
	return interval - TickHelper.getTimestampDiff(entity, id);
}

/**
 * 
 * @param {Entity_} entity 
 * @param {string} id 
 * @param {long} interval 
 */
TickHelper.hasTimestampJustElapsed = function(entity, id, interval) {
	return TickHelper.getTimestampDiff(entity, id) === interval;
}

/**
 * Sets the timestamp to the current game time
 * @param {Entity_} entity 
 * @param {string} id 
 */
TickHelper.forceUpdateTimestamp = function(entity, id) {
	entity.persistentData.putLong(id, TickHelper.getGameTime(entity.server));
}

/**
 * Sets the timestamp `time` ticks before the current game time
 * @param {Entity_} entity 
 * @param {string} id 
 * @param {long} time 
 */
TickHelper.setTimestampBefore = function(entity, id, time) {
	entity.persistentData.putLong(id, TickHelper.getGameTime(entity.server) - time);
}

/**
 * Sets the timestamp `time` ticks after the current game time
 * @param {Entity_} entity 
 * @param {string} id 
 * @param {long} time 
 */
TickHelper.setTimestampAfter = function(entity, id, time) {
	entity.persistentData.putLong(id, TickHelper.getGameTime(entity.server) + time);
}

/**
 * Sets timestamp to Long.MIN_VALUE so that hasTimestampPassed() always returns true
 * @param {Entity_} entity 
 * @param {string} id 
 */
TickHelper.resetTimestamp = function(entity, id) {
	entity.persistentData.putLong(id, $Long.MIN_VALUE)
}

/**
 * 
 * @param {Entity_} entity 
 * @param {string} id 
 */
TickHelper.removeTimestamp = function(entity, id) {
	entity.persistentData.remove(id);
}

/**
 * Updates the timestamp to current game time if it has elapsed
 * @param {Entity_} entity 
 * @param {string} id
 * @param {long} interval
 * @returns {boolean} true if timestamp was successfully updated after elapsing
 */
TickHelper.tryUpdateTimestamp = function(entity, id, interval) {
	if (TickHelper.hasTimestampElapsed(entity, id, interval)) {
		TickHelper.forceUpdateTimestamp(entity, id);
		return true;
	}
	return false;
}



/**
 * @param {MinecraftServer_} server
 * @param {integer} ticks 
 * @returns 
 */
TickHelper.toSeconds = function(server, ticks) {
	return (ticks / TickHelper.getDefaultTickRate(server)).toFixed(1);
}