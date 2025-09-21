PlayerEvents.loggedIn(event => {
	const { player, server } = event;
	PlayerUUIDUsernameBiMap.registerPlayer(server, player.uuid.toString(), player.username);
	PlayerUUIDUsernameBiMap.loadData(server);
});