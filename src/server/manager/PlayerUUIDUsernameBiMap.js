const PlayerUUIDUsernameBiMap = {};

/** @type {Object.<string, string>} */
PlayerUUIDUsernameBiMap.uuid_to_username = {};
/** @type {Object.<string, string>} */
PlayerUUIDUsernameBiMap.username_to_uuid = {};

/**
 * 
 * @param {MinecraftServer_} server 
 */
PlayerUUIDUsernameBiMap.loadData = function(server) {
	PlayerUUIDUsernameBiMap.uuid_to_username = {};
	PlayerUUIDUsernameBiMap.username_to_uuid = {};

	const tag = server.persistentData.getCompound("player_uuid_to_username");
	tag.allKeys.forEach(uuid => {
		const username = tag.getString(uuid);
		PlayerUUIDUsernameBiMap.uuid_to_username[uuid] = username;
		PlayerUUIDUsernameBiMap.username_to_uuid[username] = uuid;
	});
}

/**
 * @param {MinecraftServer_} server 
 */
PlayerUUIDUsernameBiMap.reloadData = function(server) {
	PlayerUUIDUsernameBiMap.registerOnlinePlayers(server);
	PlayerUUIDUsernameBiMap.loadData(server);
}

/**
 * 
 * @param {MinecraftServer_} server
 * @param {string} uuid 
 * @param {string} username 
 */
PlayerUUIDUsernameBiMap.registerPlayer = function(server, uuid, username) {
	const tag = server.persistentData.getCompound("player_uuid_to_username");
	tag.putString(uuid, username);
	server.persistentData.put("player_uuid_to_username", tag);
}

/**
 * @param {MinecraftServer_} server 
 */
PlayerUUIDUsernameBiMap.registerOnlinePlayers = function(server) {
	server.playerList.players.forEach(player => {
		PlayerUUIDUsernameBiMap.registerPlayer(server, player.stringUUID, player.username);
	});
}





/**
 * @param {MinecraftServer_} server
 * @param {string} username
 * @returns {import("java.util.UUID").$UUID$$Original | null}
 */
PlayerUUIDUsernameBiMap.getUUID = function(server, username) {
	if (ObjectHelper.isEmpty(PlayerUUIDUsernameBiMap.username_to_uuid)) {
		PlayerUUIDUsernameBiMap.reloadData(server)
	}

	return UUID.fromString(PlayerUUIDUsernameBiMap.username_to_uuid[username]);
}

/**
 * @param {MinecraftServer_} server
 * @param {string} uuid
 * @returns {string | null} 
 */
PlayerUUIDUsernameBiMap.getUsername = function(server, uuid) {
	if (ObjectHelper.isEmpty(PlayerUUIDUsernameBiMap.uuid_to_username)) {
		PlayerUUIDUsernameBiMap.reloadData(server)
	}

	return PlayerUUIDUsernameBiMap.uuid_to_username[uuid];
}

/**
 * @param {MinecraftServer_} server
 * @returns {string[]}
 */
PlayerUUIDUsernameBiMap.getUsernames = function(server) {
	if (ObjectHelper.isEmpty(PlayerUUIDUsernameBiMap.username_to_uuid)) {
		PlayerUUIDUsernameBiMap.reloadData(server)
	}

	return Object.keys(PlayerUUIDUsernameBiMap.username_to_uuid);
}