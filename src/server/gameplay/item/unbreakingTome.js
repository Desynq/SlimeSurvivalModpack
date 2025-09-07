/** @type {typeof import("net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$EntityInteract").$PlayerInteractEvent$EntityInteract } */
let $PlayerInteractEvent$EntityInteract  = Java.loadClass("net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$EntityInteract")
/** @type {typeof import("net.minecraft.world.entity.item.ItemEntity").$ItemEntity } */
let $ItemEntity  = Java.loadClass("net.minecraft.world.entity.item.ItemEntity")

ServerEvents.tick(event => {
	const server = event.server;

	const groundedItemEntities = server.getEntities().filter(e => e.type == "minecraft:item");
	// const unbreakingTomes = groundedItemEntities.filter([e => e.item.id == "slimesurvival:unbreaking_tome"]);
});