// priority: 100

namespace MovementDragImpl {
	/**
	 * 
	 * @param speed The speed to calculate the drag percentage off of
	 * @param k Drag coefficient
	 * @param baseSpeed Minimum speed to begin applying drag to.
	 * @returns 
	 */
	function calcDragPercent(speed: number, k: number, baseSpeed: number): number {
		const excess = speed - baseSpeed;
		if (excess <= 0) return 0;

		return (k * excess) / (1 + k * excess);
	}

	const mod = new AttributeModifierController(
		"minecraft:generic.movement_speed",
		"movement_drag",
		0.0,
		"add_multiplied_total"
	);

	PlayerEvents.tick(event => {
		const player = event.player as ServerPlayer_;

		mod.remove(player);

		const baseSpeed = player.getAttributeBaseValue($Attributes.MOVEMENT_SPEED);
		const totalSpeed = player.getAttributeValue($Attributes.MOVEMENT_SPEED);
		const drag = calcDragPercent(totalSpeed, 0.5, baseSpeed);

		mod.apply(player, -drag);
	});
}