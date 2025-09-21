// @ts-nocheck
LootJS.modifiers(event => {
	event
		.addTableModifier("cataclysm:entities/cindaria")
		.addLoot(LootEntry.of("minecraft:slime_ball").setCount([24, 40]));
});