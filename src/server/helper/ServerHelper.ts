// priority: 1000

class ServerHelper {
	public static getPlayers(server: MinecraftServer_): ServerPlayer_[] {
		return server.playerList.players.toArray();
	}

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

	public static setGamerule(server: MinecraftServer_, id: string, value: boolean | integer): void {
		const command = `gamerule ${id} ${value}`;
		server.runCommandSilent(command);
	}

	public static setPDGamerule(server: MinecraftServer_, dimension: string, id: string, value: boolean | integer | "clear!"): void {
		const command = `execute in ${dimension} run pdgamerule ${id} ${value}`;
		server.runCommandSilent(command);
	}

	public static addMobToGriefingBlacklist(server: MinecraftServer_, mobId: string, add: boolean = true) {
		const command = `gmg ${add ? "add" : "remove"} ${mobId}`;
		server.runCommand(command);
	}

	public static getAllDimensions(server: MinecraftServer_): string[] {
		const dimensions: string[] = [];

		server.getAllLevels().forEach(level => {
			const dimension = level.dimension.toString();
			dimensions.push(dimension);
		});
		return dimensions;
	}
}