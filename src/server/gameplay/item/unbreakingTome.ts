/** @type {typeof import("net.minecraft.world.item.component.Unbreakable").$Unbreakable } */
let $Unbreakable = Java.loadClass("net.minecraft.world.item.component.Unbreakable");
/** @type {typeof import("net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$EntityInteract").$PlayerInteractEvent$EntityInteract } */
let $PlayerInteractEvent$EntityInteract = Java.loadClass("net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$EntityInteract");
/** @type {typeof import("net.minecraft.world.entity.item.ItemEntity").$ItemEntity } */
let $ItemEntity = Java.loadClass("net.minecraft.world.entity.item.ItemEntity");

/**
 * 
 * @param {ItemEntity} tome 
 * @param {ItemEntity[]} otherItemEntities
 */
function UnbreakingTomeTick(tome: ItemEntity, otherItemEntities: ItemEntity[]) {
	let itemEntitiesSorted: [double, ItemEntity][] = [];
	for (let i = 0; i < otherItemEntities.length; i++) {
		let closestItem = otherItemEntities[i];
		if (closestItem === tome) {
			continue;
		};
		// @ts-ignore
		let dis = tome.position().distanceTo(closestItem.position());
		itemEntitiesSorted.push([dis, closestItem]);
	}

	itemEntitiesSorted.sort((a, b) => a[0] - b[0]);

	let target = itemEntitiesSorted[0][1];
	let targetdis = itemEntitiesSorted[0][0];
	if (targetdis > 10) { return; };

	let targetEnchants = target.getItem()?.getComponents()?.get($DataComponents.ENCHANTMENTS);
	if (!targetEnchants) return;
	const perchanceMending = tome.level.registryAccess().registryOrThrow($Registries.ENCHANTMENT).getHolder("minecraft:mending");
	if (!perchanceMending.isPresent()) return;
	const actualMending = perchanceMending.get();
	targetEnchants.getLevel(actualMending);
	if (targetEnchants.getLevel(actualMending) <= 0) return;
	setItemUnbreakable(target.item);
	tome.kill();
}

/**
 * 
 * @param {ItemStack} item 
 */
function setItemUnbreakable(item) {
	const unbreakable = new $Unbreakable(true);

	// @ts-ignore
	item.set($DataComponents.UNBREAKABLE, unbreakable);
}