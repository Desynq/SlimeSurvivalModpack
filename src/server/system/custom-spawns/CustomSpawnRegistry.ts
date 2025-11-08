// priority: 1



class CustomSpawnRegistry {

	public static readonly INSTANCE = new CustomSpawnRegistry();

	private readonly overrides: Record<string, SpawnTable> = {};

	public setOverride(entityId: string, spawnTable: SpawnTable): CustomSpawnRegistry {
		this.overrides[entityId] = spawnTable;
		return CustomSpawnRegistry.INSTANCE;
	}



	public registerAll(): void {
		for (const [entityId, spawnTable] of Object.entries(this.overrides)) {
			this.register(entityId, spawnTable);
		}
	}

	private register(entityId: string, spawnTable: SpawnTable): void {
		EntityEvents.checkSpawn(entityId as any, event => {
			if (event.type === $MobSpawnType.COMMAND) return; // avoids continually

			const entity = event.getEntity();
			const pos = entity.position();
			const level = event.level as ServerLevel_;

			const summonable = spawnTable.roll(event);
			if (summonable) {
				summonable?.spawn(level, pos, false);
				event.cancel();
			}
		});
	}
}