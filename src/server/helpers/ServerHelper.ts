class ServerHelper {
	public static numberOfNonOperators(server: MinecraftServer_) {
		return server.playerList.players
			.stream()
			.filter(p => !PlayerHelper.isOperator(p))
			.count();
	}

	public static getSurvivors(server: MinecraftServer_): ServerPlayer_[] {
		return server.getPlayerList().getPlayers()
			.stream()
			.filter(p => PlayerHelper.isSurvivalLike(p))
			.toArray();
	}

	public static getSurvivorCount(server: MinecraftServer_) {
		return this.getSurvivors(server).length;
	}
}