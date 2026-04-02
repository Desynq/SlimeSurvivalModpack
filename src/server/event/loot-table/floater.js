// @ts-nocheck
LootJS.modifiers(event => {
	event
		.addTableModifier("mowziesmobs:entities/lantern")
		.addLoot(LootEntry.of("minecraft:slime_ball")
			.setCount([16, 32])
			.applyBonus('minecraft:looting', 32)
		)
});
