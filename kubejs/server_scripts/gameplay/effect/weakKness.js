/** @type {typeof import("net.minecraft.network.protocol.game.ClientboundSetEntityMotionPacket").$ClientboundSetEntityMotionPacket } */
let $ClientboundSetEntityMotionPacket  = Java.loadClass("net.minecraft.network.protocol.game.ClientboundSetEntityMotionPacket")


NativeEvents.onEvent($LivingEvent$LivingJumpEvent, event => {
	const player = event.entity instanceof $ServerPlayer ? event.entity : null;
	if (player == null) {
		return;
	}
	const effect = player.getEffect("slimesurvival:weak_knees");
	if (effect == null) {
		return;
	}

	const effectJumpPower = -Math.min(0.1 * (effect.amplifier + 1), player.jumpPower);

	player.addDeltaMovement(new $Vec3(0, effectJumpPower, 0))
	player.connection.send(new $ClientboundSetEntityMotionPacket(player));
});