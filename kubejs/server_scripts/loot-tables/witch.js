// @ts-nocheck
LootJS.lootTables(e => {
	e
		.getEntityTable("minecraft:witch")
		.firstPool()
		.addEntry(LootEntry.of("minecraft:lapis_lazuli").withWeight(5).setCount([0, 2]))
})