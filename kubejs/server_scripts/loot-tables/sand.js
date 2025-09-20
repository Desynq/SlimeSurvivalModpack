// @ts-nocheck
LootJS.lootTables(e => {
	e.getBlockTable('minecraft:sand').firstPool()
		.addEntry(LootEntry.of('minecraft:quartz')
			.setCount(1)
			.withWeight(0.0005)
			.applyOreBonus('minecraft:fortune')
		)
});