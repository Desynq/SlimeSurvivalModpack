const PlayerUuidUsernameBiMap = {
};

PlayerUuidUsernameBiMap.uuid_to_username = {};
PlayerUuidUsernameBiMap.username_to_uuid = {};

/**
 * 
 * @param {$MinecraftServer_} server 
 */
PlayerUuidUsernameBiMap.loadData = function (server) {
	PlayerUuidUsernameBiMap.uuid_to_username = {};
	PlayerUuidUsernameBiMap.username_to_uuid = {};

	const tag = server.persistentData.getCompound("player_uuid_to_username");
	tag.getAllKeys().forEach(uuid => {
		const username = tag.getString(uuid);
		PlayerUuidUsernameBiMap.uuid_to_username[uuid] = username;
		PlayerUuidUsernameBiMap.username_to_uuid[username] = uuid;
	});
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
 * 
 * @param {string} param
 * @returns {string}
 */
PlayerUuidUsernameBiMap.getUuid = function (username) {
	PlayerUuidUsernameBiMap.username_to_uuid[username];
}

/**
 * 
 * @param {string} uuid
 * @returns {string} 
 */
PlayerUuidUsernameBiMap.getUsername = function (uuid) {
	PlayerUuidUsernameBiMap.uuid_to_username[uuid];
}