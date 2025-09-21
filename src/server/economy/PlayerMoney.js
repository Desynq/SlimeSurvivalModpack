const PlayerMoney = {};

/**
 * @param {MinecraftServer} server 
 * @param {string} uuid 
 * @returns {number}
 */
PlayerMoney.get = function(server, uuid) {
	return server.persistentData.getCompound("player_money").getLong(uuid);
}

/**
 * @param {MinecraftServer} server 
 * @param {string} uuid 
 * @param {number} amount 
 */
PlayerMoney.set = function(server, uuid, amount) {
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
 * @param {number} amount 
 */
PlayerMoney.add = function(server, uuid, amount) {
	const currentMoney = PlayerMoney.get(server, uuid);
	PlayerMoney.set(server, uuid, currentMoney + amount);
}