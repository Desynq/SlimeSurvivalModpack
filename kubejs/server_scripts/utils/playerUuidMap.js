const PlayerUuidUsernameBiMap = {
};

PlayerUuidUsernameBiMap.uuid_to_username = null;
PlayerUuidUsernameBiMap.username_to_uuid = null;

/**
 * 
 * @param {$MinecraftServer_} server 
 */
PlayerUuidUsernameBiMap.loadData = function (server) {
	PlayerUuidUsernameBiMap.uuid_to_username = {};
	PlayerUuidUsernameBiMap.username_to_uuid = {};

	const tag = server.persistentData.getCompound("player_uuid_to_username");
	tag.allKeys.forEach(uuid => {
		const username = tag.getString(uuid);
		PlayerUuidUsernameBiMap.uuid_to_username[uuid] = username;
		PlayerUuidUsernameBiMap.username_to_uuid[username] = uuid;
	});
}

/**
 * @param {$MinecraftServer_} server 
 */
PlayerUuidUsernameBiMap.reloadData = function (server) {
	PlayerUuidUsernameBiMap.registerOnlinePlayers(server);
	PlayerUuidUsernameBiMap.loadData(server);
}

/**
 * 
 * @param {$MinecraftServer_} server
 * @param {string} uuid 
 * @param {string} username 
 */
PlayerUuidUsernameBiMap.registerPlayer = function (server, uuid, username) {
	const tag = server.persistentData.getCompound("player_uuid_to_username");
	tag.putString(uuid, username);
	server.persistentData.put("player_uuid_to_username", tag);
}

/**
 * @param {$MinecraftServer_} server 
 */
PlayerUuidUsernameBiMap.registerOnlinePlayers = function (server) {
	server.playerList.players.forEach(player => {
		PlayerUuidUsernameBiMap.registerPlayer(server, player.uuid.toString(), player.username);
	});
}





/**
 * @param {$MinecraftServer_} server
 * @param {string} param
 * @returns {string | null}
 */
PlayerUuidUsernameBiMap.getUuid = function (server, username) {
	if (PlayerUuidUsernameBiMap.username_to_uuid == null) {
		PlayerUuidUsernameBiMap.reloadData(server)
	}

	return PlayerUuidUsernameBiMap.username_to_uuid[username];
}

/**
 * @param {$MinecraftServer_} server
 * @param {string} uuid
 * @returns {string | null} 
 */
PlayerUuidUsernameBiMap.getUsername = function (server, uuid) {
	if (PlayerUuidUsernameBiMap.uuid_to_username == null) {
		PlayerUuidUsernameBiMap.reloadData(server)
	}

	return PlayerUuidUsernameBiMap.uuid_to_username[uuid];
}

/**
 * @param {$MinecraftServer_} server
 * @returns {string[]}
 */
PlayerUuidUsernameBiMap.getUsernames = function (server) {
	if (PlayerUuidUsernameBiMap.username_to_uuid == null) {
		PlayerUuidUsernameBiMap.reloadData(server)
	}

	return Object.keys(PlayerUuidUsernameBiMap.username_to_uuid);
}