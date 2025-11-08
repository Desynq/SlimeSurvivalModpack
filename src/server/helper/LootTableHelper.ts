// priority: 1000

namespace LootTableHelper {


	export function getLootTable(server: MinecraftServer_, id: string): LootTable_ {
		const rk = $ResourceKey.create($Registries.LOOT_TABLE, id);
		const lootTable = server.reloadableRegistries().getLootTable(rk);

		return lootTable;
	}

	export function giveLoot(player: ServerPlayer_, id: string): void {
		const lootTable = getLootTable(player.server, id);

		const params = new $LootParams$Builder(player.level as ServerLevel_)
			.withParameter($LootContextParams.THIS_ENTITY, player)
			.withParameter($LootContextParams.ORIGIN, player.position())
			.create($LootContextParamSets.CHEST);

		const items = lootTable.getRandomItems(params);

		for (const stack of items) {
			if (!player.addItem(stack as any)) {
				player.drop(stack, false);
			}
		}
	}
}