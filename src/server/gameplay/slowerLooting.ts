
/** @type {typeof import("net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$RightClickBlock").$PlayerInteractEvent$RightClickBlock} */
let $PlayerInteractEvent$RightClickBlock = Java.loadClass("net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$RightClickBlock");

(function () {
	/**
	 * 
	 * @param {ServerPlayer_} player 
	 */
	function isBeingTargeted(player) {
		const aabb = player.getBoundingBox().inflate(16, 16, 16);
		return player.level
			// @ts-ignore
			.getEntitiesOfClass($Mob, aabb, mob => LivingEntityHelper.isBeingTargetedBy(player, mob))
			.size() > 0;
	}

	/**
	 * 
	 * @param {ServerPlayer_} player 
	 * @param {import("dev.latvian.mods.kubejs.level.LevelBlock").$LevelBlock$$Original} block 
	 */
	function canOpen(player: ServerPlayer_, block) {
		if (!PlayerHelper.isSurvivalLike(player)) return true;

		if (isBeingTargeted(player)) {
			return false;
		}

		const aabb = player.boundingBox.inflate(player.getAttributeTotalValue($Attributes.BLOCK_INTERACTION_RANGE) * 2);
		const isOperatorBlocking = player.level.getEntitiesOfClass($ServerPlayer as any, aabb as any, (p: ServerPlayer_) => PlayerHelper.isOperator(p) && p.isHolding($Items.TRAPPED_CHEST)).size() > 0;
		if (isOperatorBlocking) return false;

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