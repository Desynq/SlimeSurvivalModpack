// @ts-nocheck
LootJS.modifiers(event => {
	event
		.addTableModifier("minecraft:entities/bat")
		.addLoot(LootEntry.of("minecraft:leather").setCount([0, 1]));
});
