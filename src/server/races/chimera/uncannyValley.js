/** @type {typeof import("net.neoforged.neoforge.event.entity.EntityJoinLevelEvent").$EntityJoinLevelEvent } */
let $EntityJoinLevelEvent = Java.loadClass("net.neoforged.neoforge.event.entity.EntityJoinLevelEvent")

// @ts-ignore
/** @type {typeof import("net.minecraft.world.entity.ai.goal.AvoidEntityGoal").$AvoidEntityGoal} */
let $AvoidEntityGoal = Java.loadClass("net.minecraft.world.entity.ai.goal.AvoidEntityGoal");


(function() {

	/**
	 * 
	 * @param {Entity_} entity 
	 * @param {ServerPlayer_} player 
	 */
	function shouldAvoid(entity, player) {
		if (entity instanceof $Creeper) {
			return player.isCuriosEquipped($Items.CREEPER_HEAD)
				|| player.getItemBySlot("head").is($Items.CARVED_PUMPKIN);
		}
		return false;
	}



	NativeEvents.onEvent($EntityJoinLevelEvent, event => {
		const entity = event.getEntity();
		if (entity instanceof $Creeper) {
			entity.goalSelector.addGoal(2, $AvoidEntityGoal(
				entity,
				$ServerPlayer,
				// @ts-ignore
				(player) => shouldAvoid(entity, player),
				32.0,
				1.0,
				1.5,
				(player) => true
			));
		}
	});
})();