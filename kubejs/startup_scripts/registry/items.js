/** @type {typeof import("net.minecraft.world.item.Rarity").$Rarity } */
let $Rarity = Java.loadClass("net.minecraft.world.item.Rarity");

StartupEvents.registry("item", event => {
	event.create("slimesurvival:unbreaking_tome")
		.unstackable()
		.fireResistant()
		.rarity("epic");
})