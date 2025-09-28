let $LivingBreatheEvent = Java.loadClass("net.neoforged.neoforge.event.entity.living.LivingBreatheEvent");

/** @type {Object.<string, long>} */
const lastFallFlyingInLowOrbit = {};

PlayerEvents.tick(event => {
	const { player } = event;
	const uuid = player.uuid.toString();

	if (EntityHelper.isInLowOrbit(player)) {
		applyLowOrbitSlowFalling(player);
	}

	// if (player.airSupply < player.maxAirSupply) {
	// 	ActionbarManager.addText(
	// 		player.uuid.toString(),
	// 		`"Air: ${(player.airSupply / 20).toFixed(1)}/${(player.maxAirSupply / 20).toFixed(1)}"`
	// 	);
	// }
});

/**
 * 
 * @param {Player_} player 
 */
function applyLowOrbitSlowFalling(player) {
	if (player.isFallFlying()) {
		return;
	}
	// @ts-ignore
	const slowFallingEffect = new $MobEffectInstance("minecraft:slow_falling", 39, 0, true, false, true);
	player.addEffect(slowFallingEffect);
}

/**
 * @param {Player_} player
 * @returns {boolean}
 */
function cannotFallFlyInLowOrbit(player) {
	return player.abilities.flying
		|| player.onGround()
		|| player.isPassenger()
		|| player.hasEffect($MobEffects.LEVITATION)
		|| player.isCrouching();
}

// NativeEvents.onEvent($LivingBreatheEvent, event => {
// 	const { entity } = event;
// 	if (entity instanceof $Player && EntityHelper.isInLowOrbit(entity) && PlayerHelper.isSurvivalLike(entity)) {
// 		event.setCanBreathe(false);
// 		event.setRefillAirAmount(0);
// 		// only consume air every 4 ticks
// 		event.setConsumeAirAmount(entity.server.tickCount % 4 == 0 ? 1 : 0);
// 	}
// });