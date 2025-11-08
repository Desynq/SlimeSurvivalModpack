
class TickRateManager {

	public static hasCustomTickRate(entity: Entity_): boolean {
		return $TickrateUtil["hasTimer(net.minecraft.world.entity.Entity)"](entity);
	}

	public static getCustomTickRate(entity: Entity_): float {
		return $TickrateUtil["getTimer(net.minecraft.world.entity.Entity)"](entity).tickrate;
	}

	/**
	 * Sets or resets the entity's tick rate.
	 * 
	 * @param value If `undefined`, resets the entity's tick rate to the default.
	 */
	public static setTickRate(entity: Entity_, value?: number): void {
		const hasCustom = this.hasCustomTickRate(entity);

		if (value === undefined) {
			if (hasCustom) $TickrateUtil.resetTickrate(entity);
			return;
		}

		if (hasCustom && this.getCustomTickRate(entity) === value) return;

		$TickrateUtil.setTickrate(entity, value);
	}
}

ServerEvents.tick(event => {
	const server = event.server;

	const entities = server.entities;
	for (const entity of entities) {
		let tickRate: integer | undefined = undefined;
		if (entity instanceof $Projectile && QuantumRelativity.isLorentzProjectile(entity)) {
			tickRate = 20;
		}
		TickRateManager.setTickRate(entity, tickRate);
	}
});