/** @type {typeof import("dev.latvian.mods.kubejs.item.FoodBuilder").$FoodBuilder} */
let $FoodBuilder = Java.loadClass("dev.latvian.mods.kubejs.item.FoodBuilder");

/** @type {typeof import("net.minecraft.world.item.Rarity").$Rarity } */
let $Rarity = Java.loadClass("net.minecraft.world.item.Rarity");

StartupEvents.registry("item", event => {
	event.create("slimesurvival:unbreaking_tome")
		.unstackable()
		.fireResistant()
		.rarity("epic");

	event.create("slimesurvival:crash_helmet")
		.unstackable()
		.rarity("rare");

	event.create("slimesurvival:band_of_regeneration")
		.unstackable()
		.rarity("epic");
});

ItemEvents.modification(event => {
	event.modify("minecraft:slime_ball", item => {
		let foodProperties = new $FoodBuilder()
			.nutrition(1)
			.saturation(2)
			.eatSeconds(1)
			.effect("minecraft:poison", 100, 0, 0.8)
			.alwaysEdible()
			.build();
		item.setFood(foodProperties);
	});
})