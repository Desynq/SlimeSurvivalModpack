ServerEvents.command("reload", event => onDataLoad(event.server));
ServerEvents.loaded(event => onDataLoad(event.server));

/**
 * 
 * @param {$MinecraftServer_} server 
 */
function onDataLoad(server) {
	server.playerList.players.forEach(player => {
		PlayerUuidUsernameBiMap.registerPlayer(server, player.uuid.toString(), player.username);
	});
	PlayerUuidUsernameBiMap.loadData(server);
}