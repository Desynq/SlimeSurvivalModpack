LootJS.modifiers(event => {
	event
		.addTableModifier("mutantmonsters:entities/mutant_zombie")
		.addLoot(LootEntry.of("minecraft:rotten_flesh").setCount([32, 128]));
});