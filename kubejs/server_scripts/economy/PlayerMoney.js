const PlayerMoney = {};

/**
 * @param {$MinecraftServer_} server 
 * @param {string} playerUuid 
 * @returns {number}
 */
PlayerMoney.get = function (server, playerUuid) {
	return server.persistentData.getCompound("player_money").getLong(playerUuid);
}

/**
 * @param {$MinecraftServer_} server 
 * @param {string} playerUuid 
 * @param {number} amount 
 */
PlayerMoney.set = function (server, playerUuid, amount) {
	let compoundTag = server.persistentData.getCompound("player_money");
	if (compoundTag.empty) {
		server.persistentData.put("player_money", new $CompoundTag());
		compoundTag = server.persistentData.getCompound("player_money");
	}

	compoundTag.putLong(playerUuid, amount);
}

/**
 * @param {$MinecraftServer_} server 
 * @param {string} playerUuid 
 * @param {number} amount 
 */
PlayerMoney.add = function (server, playerUuid, amount) {
	const currentMoney = PlayerMoney.get(server, playerUuid);
	PlayerMoney.set(server, playerUuid, currentMoney + amount);
}