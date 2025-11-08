// priority: 0

const QueenBee = new QueenBeeManager(new QueenBeeRewarder()).register();

NativeEvents.onEvent($BeeStingEvent, event => {
	if (QueenBee.hasEntity()) {
		event.setCanStingAgain(true);
	}
});

NativeEvents.onEvent($EntityTickEvent$Pre, event => {
	const entity = event.entity;
	if (QueenBee.isMinion(entity)) {
		QueenBee.onMinionTick(entity);
	}
});

NativeEvents.onEvent($LivingIncomingDamageEvent, event => {
	if (event.source.getType() === "genericKill") return;
	const queenBee = event.entity;

	if (QueenBee.isCachedEntity(queenBee) && QueenBee.isInImmunityPhase(queenBee as any)) {
		event.setCanceled(true);
	}
});