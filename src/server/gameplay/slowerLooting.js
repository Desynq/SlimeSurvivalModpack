/** @type {typeof import("net.minecraft.world.entity.Mob").$Mob } */
let $Mob = Java.loadClass("net.minecraft.world.entity.Mob")
/** @type {typeof import("net.minecraft.world.entity.monster.Monster").$Monster } */
let $Monster = Java.loadClass("net.minecraft.world.entity.monster.Monster")
/** @type {typeof import("net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$RightClickBlock").$PlayerInteractEvent$RightClickBlock} */
let $PlayerInteractEvent$RightClickBlock = Java.loadClass("net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$RightClickBlock");

(function() {
	/**
	 * 
	 * @param {ServerPlayer_} player 
	 */
	function isBeingTargeted(player) {
		const aabb = player.getBoundingBox().inflate(16, 16, 16);
		// @ts-ignore
		return player.level.getEntitiesOfClass($Mob, aabb, mob => isTargeting(mob, player)).size() > 0;
	}

	/**
	 * 
	 * @param {import("net.minecraft.world.entity.Mob").$Mob$$Original} mob 
	 * @param {ServerPlayer_} player 
	 * @returns 
	 */
	function isTargeting(mob, player) {
		return mob.getTarget() == player;
	}

	/**
	 * 
	 * @param {ServerPlayer_} player 
	 * @param {import("dev.latvian.mods.kubejs.level.LevelBlock").$LevelBlock$$Original} block 
	 */
	function canOpen(player, block) {
		if (isBeingTargeted(player)) {
			return false;
		}
		return true;
	}



	BlockEvents.rightClicked("minecraft:trapped_chest", event => {
		const player = event.player;
		const block = event.block;

		if (player instanceof $ServerPlayer && !canOpen(player, block)) {
			// @ts-ignore
			ActionbarManager.setSimple(player, `{"color":"red","text":"Cannot open loot chest while being targeted!"}`, 20);
			event.cancel();
			return;
		}
	});


	BlockEvents.broken("minecraft:trapped_chest", event => {
		if (!event.player.isCreative() && !event.block.getInventory().isEmpty()) {
			event.cancel();
		}
	});
})();