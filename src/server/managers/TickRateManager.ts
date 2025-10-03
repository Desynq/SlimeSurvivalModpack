
namespace TickRateManager {

	function setProjectileTickRate(entity: Projectile_) {
		const customTickRate = TickHelper.getCustomTickRate(entity);
		if ($TickrateUtil["hasTimer(net.minecraft.world.entity.Entity)"](entity)) {
			if ($TickrateUtil["getTimer(net.minecraft.world.entity.Entity)"](entity).tickrate === customTickRate) return;
		}

		if (customTickRate == null) {
			$TickrateUtil.resetTickrate(entity);
		}
		else {
			$TickrateUtil.setTickrate(entity, customTickRate);
		}
	}


	NativeEvents.onEvent($EntityTickEvent$Pre, event => {
		const entity = event.getEntity();

		if (entity instanceof $Projectile) {
			setProjectileTickRate(entity);
		}
	});
}