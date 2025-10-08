


namespace SkillNetwork {
	function isInvisible(player: ServerPlayer_): boolean {
		return FarlanderSkills.THE_WORLD.isUnlockedFor(player) && QuantumRelativity.isActive(player);
	}

	ServerEvents.tick(event => {
		const players = event.server.playerList.players.toArray() as ServerPlayer_[];

		const invisiblePlayersPacket = new $CompoundTag();
		for (const player of players) {
			invisiblePlayersPacket.putBoolean(player.stringUUID, isInvisible(player));
		}

		for (const player of players) {
			player.sendData("InvisiblePlayers", invisiblePlayersPacket);
		}
	});
}