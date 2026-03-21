
LootJS.lootTables(e => {

	const firstPool = e.getLootTable("minecraft:gameplay/fishing/treasure").firstPool();

	firstPool.modifyItemEntry(itemEntry => {
		const baseWeight: number = itemEntry.getWeight();
		itemEntry.setWeight(baseWeight * 10);

		return itemEntry;
	});

	firstPool
		// @ts-ignore
		.addEntry(LootEntry.of("slimesurvival:axolotl_gills")
			.withWeight(5)
		)
		// @ts-ignore
		.addEntry(LootEntry.of("minecraft:turtle_scute")
			.withWeight(10)
		);
});