
let SlimeBall = {};

/**
 * @param {import("net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$RightClickItem").$PlayerInteractEvent$RightClickItem$$Original} event
 */
SlimeBall.onRightClickItem = function(event) {
	// @ts-ignore
	/** @type {Player} */ const player = event.getEntity();

	const stack = event.getItemStack();
	if (!stack.is($Items.SLIME_BALL)) {
		return;
	}

	if (player.canEat(false)) {
		// @ts-ignore
		player.startUsingItem(event.getHand());
		// @ts-ignore
		event.setCancellationResult($InteractionResult.CONSUME);
		event.setCanceled(true);
	}
}



global.slimeball = SlimeBall;
NativeEvents.onEvent($PlayerInteractEvent$RightClickItem, event => global.slimeball.onRightClickItem(event));