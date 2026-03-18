
namespace SlowerLooting {

	function isBeingTargeted(player: ServerPlayer_): boolean {
		const aabb = player.getBoundingBox().inflate(16, 16, 16);
		return player.level
			// @ts-ignore
			.getEntitiesOfClass($Mob, aabb, mob => LivingEntityHelper.isBeingTargetedBy(player, mob))
			.size() > 0;
	}

	function canOpen(player: ServerPlayer_, block: LevelBlock_): boolean {
		if (!PlayerHelper.isSurvivalLike(player)) return true;

		if (isBeingTargeted(player)) {
			return false;
		}

		const aabb = player.boundingBox.inflate(player.getAttributeTotalValue($Attributes.BLOCK_INTERACTION_RANGE) * 2);
		const isOperatorBlocking = player.level.getEntitiesOfClass($ServerPlayer as any, aabb as any, (p: ServerPlayer_) => PlayerHelper.isOperator(p) && p.isHolding($Items.TRAPPED_CHEST)).size() > 0;
		if (isOperatorBlocking) return false;

		return true;
	}



	// @ts-ignore
	BlockEvents.rightClicked("minecraft:trapped_chest", event => {
		const player = event.player as ServerPlayer_;
		const block = event.block;

		if (!canOpen(player, block)) {
			ActionbarManager.setSimple(player, `{"color":"red","text":"Cannot open loot chest while being targeted!"}`, 20);
			event.cancel();
			return;
		}
	});


	// @ts-ignore
	BlockEvents.broken("minecraft:trapped_chest", event => {
		if (!event.player.isCreative() && !event.block.getInventory().isEmpty()) {
			event.cancel();
		}
	});
}