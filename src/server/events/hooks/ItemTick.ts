// @ts-nocheck

namespace ItemTick {

	NativeEvents.onEvent($EntityTickEvent$Post, event => {
		const entity = event.getEntity();
		if (!(entity instanceof $ItemEntity)) return;

		if (isChlorineGasGrenade(entity)) {
			new ChlorineGasGrenadeTick(entity);
		}
		else if (entity.onGround() && UnbreakingTome.isUnbreakingTome(entity)) {
			UnbreakingTome.tick(entity);
		}
	});
}