PlayerEvents.loggedIn(event => {
	const { player, server } = event;
	PlayerUuidUsernameBiMap.registerPlayer(server, player.uuid.toString(), player.username);
	PlayerUuidUsernameBiMap.loadData(server);
});