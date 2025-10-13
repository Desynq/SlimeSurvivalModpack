/**
 * 
 * @param {ServerLevel_ | Level_} level
 * @param {Vec3_} position 
 * @param {string} sound 
 * @param {string} volumeType 
 * @param {number} volume 
 * @param {number} pitch 
 */
function playsound(level, position, sound, volumeType, volume, pitch) {
	CommandHelper.runCommandSilent(level.server,
		`execute in ${level.dimension.toString()} positioned ${position.x()} ${position.y()} ${position.z()} run playsound ${sound} ${volumeType} @a ~ ~ ~ ${volume} ${pitch}`
	);
}

/**
 * 
 * @param {MinecraftServer_} server 
 * @param {string} sound 
 * @param {string} volumeType 
 * @param {number} volume 
 * @param {number} pitch 
 */
function playsoundAll(server, sound, volumeType, volume, pitch) {
	server.getPlayerList().getPlayers().forEach(player => {
		CommandHelper.runCommandSilent(server,
			`execute as ${player.username} at @s run playsound ${sound} ${volumeType} @s ~ ~ ~ ${volume} ${pitch}`
		);
	});
}