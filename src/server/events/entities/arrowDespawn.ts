


namespace ArrowDespawner {

	NativeEvents.onEvent($EntityTickEvent$Post, event => {
		const arrow = event.entity;
		if (!(arrow instanceof $AbstractArrow)) return;

		if (!arrow.inGround) return;

		if (arrow.pickup !== $AbstractArrow$Pickup.ALLOWED && arrow.tickCount > 300) {
			arrow.discard();
			return;
		}

		if (arrow.onFire) {
			arrow.setRemainingFireTicks(0);
		}
	});
}