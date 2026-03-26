

namespace BlockLootImpl {

	LootJS.lootTables(event => {
		const entries = [
			LootEntry.of("minecraft:rooted_dirt")
				.when(c => c.matchTool(
					ItemFilter.hasEnchantment("minecraft:silk_touch")
				)),
			LootEntry.of("twilightforest:liveroot")
				.when(c => c.randomTableBonus("minecraft:fortune", ArrayHelper.lerpList(0.05, 0.25, 4))),
			LootEntry.of("minecraft:dirt")
		];

		event.getBlockTable("minecraft:rooted_dirt")
			.clear()
			.createPool()
			.addEntry(LootEntry.alternative(entries)
			);
	});
}