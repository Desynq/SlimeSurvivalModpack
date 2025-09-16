const WeakKnees = {};

/**
 * 
 * @param {import("net.neoforged.neoforge.event.entity.living.LivingEvent$LivingJumpEvent").$LivingEvent$LivingJumpEvent$$Original} event 
 */
WeakKnees.onLivingJumpEvent = function(event) {
	const player = event.entity instanceof $Player ? event.entity : null;
	if (player == null) {
		return;
	}
	const effect = player.getEffect("slimesurvival:weak_knees");
	if (effect == null) {
		return;
	}

	const effectJumpPower = -Math.min(0.1 * (effect.amplifier + 1), player.jumpPower);

	player.addDeltaMovement(new $Vec3(0, effectJumpPower, 0));
}

global.WeakKnees = WeakKnees
NativeEvents.onEvent($LivingEvent$LivingJumpEvent, event => global.WeakKnees.onLivingJumpEvent(event));