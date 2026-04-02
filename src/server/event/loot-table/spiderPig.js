// @ts-nocheck
LootJS.modifiers(event => {
	event
		.addTableModifier("mutantmonsters:entities/spider_pig")
		.addLoot(LootEntry.of("minecraft:string").setCount([32, 56]));
});