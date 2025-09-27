(function() {

	/**
	 * 
	 * @param {ServerPlayer_} player 
	 */
	function isFlyingWithCrashHelmet(player) {
		return PlayerHelper.wasLastFallFlying(player, 2) && PlayerHelper.hasCuriosEquipped(player, "slimesurvival:crash_helmet");
	}

	NativeEvents.onEvent($LivingIncomingDamageEvent, event => {
		let player = event.getEntity();
		if (!(player instanceof $ServerPlayer)) {
			return;
		}

		let damageType = event.source.getType();
		if (damageType != "flyIntoWall") {
			return;
		}

		if (!isFlyingWithCrashHelmet(player)) {
			return;
		}

		event.setCanceled(true);
	});

	NativeEvents.onEvent($LivingFallEvent, event => {
		let player = event.getEntity();
		if (!(player instanceof $ServerPlayer)) {
			return;
		}

		if (!isFlyingWithCrashHelmet(player)) {
			return;
		}

		event.setCanceled(true);
	});
})();