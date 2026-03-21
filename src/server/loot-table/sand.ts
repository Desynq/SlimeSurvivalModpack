


// LootJS.lootTables(e => {
// 	// @ts-ignore
// 	const pool = e.getBlockTable("minecraft:glass").firstPool();

// 	pool.conditions.remove("minecraft:match_tool");

// 	pool.entries.get(0).matchTool({
// 		// @ts-ignore
// 		predicates: {
// 			enchantments: [
// 				{
// 					enchantments: "minecraft:silk_touch",
// 					min: 1
// 				}
// 			]
// 		}
// 	});

// 	// @ts-ignore
// 	pool.addEntry(LootEntry.of("minecraft:quartz")
// 		// @ts-ignore
// 		.randomTableBonus("minecraft:fortune", [0.25, 0.5, 0.75, 1.0])
// 	);

// 	// @ts-ignore
// 	// e.getBlockTable("minecraft:glass").firstPool()
// 	// 	// @ts-ignore
// 	// 	.addEntry(LootEntry.of("minecraft:quartz")
// 	// 		.setCount(1)
// 	// 		.randomTableBonus("minecraft:fortune", [0.1, 0.25, 0.5, 0.75])
// 	// 	);
// });