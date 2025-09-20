global.PlayerMoney = {};

/**
 * @param {MinecraftServer} server 
 * @param {string} uuid 
 * @returns {long}
 */
global.PlayerMoney.get = function(server, uuid) {
	return server.persistentData.getCompound("player_money").getLong(uuid);
}

/**
 * @param {MinecraftServer} server 
 * @param {string} uuid 
 * @param {long} amount 
 */
global.PlayerMoney.set = function(server, uuid, amount) {
	let compoundTag = server.persistentData.getCompound("player_money");
	if (compoundTag.empty) {
		server.persistentData.put("player_money", new $CompoundTag());
		compoundTag = server.persistentData.getCompound("player_money");
	}

	compoundTag.putLong(uuid, amount);
}

/**
 * @param {MinecraftServer} server 
 * @param {string} uuid 
 * @param {long} amount 
 */
global.PlayerMoney.add = function(server, uuid, amount) {
	const currentMoney = PlayerMoney.get(server, uuid);
	global.PlayerMoney.set(server, uuid, currentMoney + amount);
}