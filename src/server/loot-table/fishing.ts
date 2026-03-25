

namespace FishingLootModifier {
	// @ts-ignore
	type LootTableEventJS_ = import("com.almostreliable.lootjs.kube.LootTableEventJS").$LootTableEventJS;

	LootJS.lootTables(e => {
		modifyTreasure(e);
		modifyFish(e);
	});

	function modifyTreasure(e: LootTableEventJS_) {
		const firstPool = e.getLootTable("minecraft:gameplay/fishing/treasure").firstPool();

		// firstPool.modifyItemEntry(itemEntry => {
		// 	const baseWeight: number = itemEntry.getWeight();
		// 	itemEntry.setWeight(baseWeight * 10);

		// 	return itemEntry;
		// });

		firstPool
			// @ts-ignore
			.addEntry(LootEntry.of("slimesurvival:axolotl_gills")
				.withWeight(1)
			)
			// @ts-ignore
			.addEntry(LootEntry.of("minecraft:turtle_scute")
				.withWeight(1)
			);
	}

	function modifyFish(e: LootTableEventJS_) {
		const firstPool = e.getLootTable("minecraft:gameplay/fishing/fish").firstPool();

		firstPool
			// @ts-ignore
			.addEntry(LootEntry.of("minecraft:prismarine_shard")
				.withWeight(1)
			)
			// @ts-ignore
			.addEntry(LootEntry.of("minecraft:prismarine_crystals")
				.withWeight(1)
			);
	}
}