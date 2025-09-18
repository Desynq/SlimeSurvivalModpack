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
})