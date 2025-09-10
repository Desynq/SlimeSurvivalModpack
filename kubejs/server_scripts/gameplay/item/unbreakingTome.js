/** @type {typeof import("net.minecraft.world.item.component.Unbreakable").$Unbreakable } */
let $Unbreakable = Java.loadClass("net.minecraft.world.item.component.Unbreakable")
/** @type {typeof import("net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$EntityInteract").$PlayerInteractEvent$EntityInteract } */
let $PlayerInteractEvent$EntityInteract = Java.loadClass("net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$EntityInteract")
/** @type {typeof import("net.minecraft.world.entity.item.ItemEntity").$ItemEntity } */
let $ItemEntity = Java.loadClass("net.minecraft.world.entity.item.ItemEntity")

ServerEvents.tick(event => {
	const server = event.server;

	const groundedItemEntities = server.getEntities().filter(e => e.type == "minecraft:item" && e.onGround());
	const unbreakingTomes = groundedItemEntities.filter(e => e.item.id == "slimesurvival:unbreaking_tome");
	unbreakingTomes.forEach(tome => UnbreakingTomeTick(tome, groundedItemEntities));
});

/**
 * 
 * @param {ItemEntity} tome 
 * @param {ItemEntity[]} otherItemEntities
 */
function UnbreakingTomeTick(tome, otherItemEntities) {
	/** @type {Array<[double, ItemEntity]>} */
	let itemdis = []
	for (let i = 0; i < otherItemEntities.length; i++) {
		let theitem = otherItemEntities[i];
		if (theitem === tome) { continue };
		let dis = tome.position().distanceTo(theitem.position());
		itemdis.push([dis, theitem]);
	}

	itemdis.sort((a, b) => a[0] - b[0]);

	let target = itemdis[0][1];
	let targetdis = itemdis[0][0];
	if (targetdis > 10) { return };

	setItemUnbreakable(target.item);
	tome.kill()
}

/**
 * 
 * @param {ItemStack} item 
 */
function setItemUnbreakable(item) {
	const unbreakable = new $Unbreakable(true);
	item.set($DataComponents.UNBREAKABLE, unbreakable);
}