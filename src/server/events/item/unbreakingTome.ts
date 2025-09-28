/** @type {typeof import("net.minecraft.world.item.component.Unbreakable").$Unbreakable } */
let $Unbreakable = Java.loadClass("net.minecraft.world.item.component.Unbreakable");
/** @type {typeof import("net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$EntityInteract").$PlayerInteractEvent$EntityInteract } */
let $PlayerInteractEvent$EntityInteract = Java.loadClass("net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$EntityInteract");

namespace UnbreakingTome {

	export function isUnbreakingTome(tome: ItemEntity) {
		return isLesserUnbreakingTome(tome) || isGreaterUnbreakingTome(tome);
	}

	export function isLesserUnbreakingTome(tome: ItemEntity) {
		return tome.item.id.toString() === "slimesurvival:lesser_unbreaking_tome";
	}

	export function isGreaterUnbreakingTome(tome: ItemEntity) {
		return tome.item.id.toString() === "slimesurvival:unbreaking_tome";
	}

	/**
	 * 
	 * @param {ItemEntity} tome 
	 * @param {ItemEntity[]} itemEntities
	 */
	export function tick(tome: ItemEntity) {
		const target = getTarget(tome);
		if (!target) return;

		if (isLesserUnbreakingTome(tome)) {
			tickLesser(tome, target);
		}
		else {
			tickGreater(tome, target);
		}
	}

	function getTarget(tome: ItemEntity): ItemEntity | null {
		const predicate = (e: ItemEntity) => e.onGround();
		const aabb = tome.boundingBox.inflate(10, 10, 10);
		// @ts-ignore
		const candidates = tome.level.getEntitiesOfClass($ItemEntity, aabb, predicate);
		let closest: ItemEntity | null = null;
		let bestDist = Number.POSITIVE_INFINITY;

		for (const item of candidates.toArray() as ItemEntity[]) {
			if (item === tome) continue;

			// @ts-ignore
			const distSq = item.distanceToEntitySqr(tome);
			if (distSq < bestDist) {
				bestDist = distSq;
				closest = item;
			}
		}

		return closest;
	}

	function tickGreater(tome: ItemEntity, target: ItemEntity) {
		setItemUnbreakable(target.item);
		executeAnimation(tome, target);
		tome.kill();
	}

	function tickLesser(tome: ItemEntity, target: ItemEntity) {
		let targetEnchants = target.getItem()?.getComponents()?.get($DataComponents.ENCHANTMENTS);
		if (!targetEnchants) return;

		const perchanceMending = tome.level.registryAccess().registryOrThrow($Registries.ENCHANTMENT).getHolder("minecraft:mending");
		if (perchanceMending.isEmpty()) return;

		const actualMending = perchanceMending.get();
		if (targetEnchants.getLevel(actualMending) <= 0) return;

		setItemUnbreakable(target.item);
		executeAnimation(tome, target);
		tome.kill();
	}

	function setItemUnbreakable(item: ItemStack_) {
		const unbreakable = new $Unbreakable(true);

		// @ts-ignore
		item.set($DataComponents.UNBREAKABLE, unbreakable);
		item.setDamage(0);
	}

	function executeAnimation(tome: ItemEntity, target: ItemEntity) {
		target.level.spawnLightning(target.x, target.y, target.z, true);
		playsound(target.level, target.position(), "minecraft:item.trident.thunder", "master", 4, 1);
		target.setPickupDelay(20);
	}
}