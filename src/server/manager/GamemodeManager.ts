// priority: 2

class PlayerGamemodeManager {
	public readonly survivalVetoes: Record<string, true> = {};

	public constructor(
		public readonly playerUUID: string
	) { }

	public tick(server: MinecraftServer_): void {
		const player = server.getEntityByUUID(this.playerUUID);
		if (!(player instanceof $ServerPlayer)) return;
	}

	public isVetoed(player: ServerPlayer_): boolean {
		const vetoCount = Object.keys(this.survivalVetoes).length;
		return vetoCount > 0;
	}
}

class GamemodeManager {

	public static readonly managers: Record<string, PlayerGamemodeManager>;
}