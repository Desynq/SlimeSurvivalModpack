// @ts-nocheck
LootJS.lootTables(e => {
	e.getBlockTable('minecraft:netherrack').firstPool()
		.addEntry(LootEntry.of('minecraft:netherite_scrap')
			.setCount(1)
			.randomChance(0.002)
			.applyOreBonus('minecraft:fortune')
		)
});