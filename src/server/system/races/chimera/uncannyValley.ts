(function () {

	/**
	 * 
	 * @param {Entity_} entity 
	 * @param {ServerPlayer_} player 
	 */
	function shouldAvoid(entity, player) {
		if (entity instanceof $Creeper && player.curiosInventory) {
			return player.isCuriosEquipped($Items.CREEPER_HEAD)
				|| player.getItemBySlot("head").is($Items.CARVED_PUMPKIN);
		}
		return false;
	}



	NativeEvents.onEvent($EntityJoinLevelEvent, event => {
		const entity = event.getEntity();
		if (entity instanceof $Creeper) {
			entity.goalSelector.addGoal(2, new $AvoidEntityGoal(
				entity as any,
				$ServerPlayer as any,
				(player) => shouldAvoid(entity, player),
				32.0,
				1.0,
				1.5,
				(player) => true
			));
		}
	});
})();