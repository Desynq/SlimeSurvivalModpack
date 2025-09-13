let $LivingBreatheEvent = Java.loadClass("net.neoforged.neoforge.event.entity.living.LivingBreatheEvent");
let $MobEffects = Java.loadClass("net.minecraft.world.effect.MobEffects");

/** @type {Object.<string, long>} */
const lastFallFlyingInLowOrbit = {};

PlayerEvents.tick(event => {
	const { player } = event;
	const uuid = player.uuid.toString();

	if (EntityHelper.isInLowOrbit(player)) {
		applyLowOrbitSlowFalling(player);

		const oldTime = lastFallFlyingInLowOrbit[uuid] ?? 0;
		const currentTime = player.level.time;
		if (currentTime - oldTime == 1 && !cannotFallFlyInLowOrbit(player)) {
			lastFallFlyingInLowOrbit[uuid] = currentTime;
			player.startFallFlying();
		}
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
 * @param {Player} player 
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
 * @param {Player} player
 * @returns {boolean}
 */
function cannotFallFlyInLowOrbit(player) {
	return player.abilities.flying
		|| player.onGround()
		|| player.isPassenger()
		|| player.hasEffect($MobEffects.LEVITATION)
		|| player.isCrouching();
}

NetworkEvents.dataReceived("KeyPressed", event => {
	const player = event.player;
	const uuid = player.uuid.toString();
	const key = event.data.getString("key");

	if (key != "jump") {
		return;
	}

	if (AirborneTime.get(player) >= 5 && EntityHelper.isInLowOrbit(player)) {
		player.startFallFlying();
		lastFallFlyingInLowOrbit[uuid] = player.level.time;
	}
});

// NativeEvents.onEvent($LivingBreatheEvent, event => {
// 	const { entity } = event;
// 	if (entity instanceof $Player && EntityHelper.isInLowOrbit(entity) && PlayerHelper.isSurvivalLike(entity)) {
// 		event.setCanBreathe(false);
// 		event.setRefillAirAmount(0);
// 		// only consume air every 4 ticks
// 		event.setConsumeAirAmount(entity.server.tickCount % 4 == 0 ? 1 : 0);
// 	}
// });