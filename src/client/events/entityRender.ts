

namespace InvisibleRenderer {
	let invisiblesPacket: CompoundTag_ | undefined;

	NetworkEvents.dataReceived("invisible_entities", event => {
		invisiblesPacket = event.data;
	});

	function isInvisible(entity: Entity_): boolean {
		const inverted = invisiblesPacket?.getBoolean("__inverted__") ?? false;
		const invisible = invisiblesPacket?.getBoolean(entity.stringUUID) ?? false;

		if (inverted) {
			return !invisible;
		}
		else {
			return invisible;
		}
	}

	NativeEvents.onEvent($IsInvisibleEvent, event => {
		const entity = event.getEntity();
		if (isInvisible(entity)) {
			event.setInvisibility(true);
		}
	});

	// NativeEvents.onEvent($IsGlowingEvent, event => {
	// 	const entity = event.getEntity();
	// 	if (entity instanceof $LivingEntity && isInvisible(entity)) {
	// 		event.setGlowing(true);
	// 	}
	// });

	NativeEvents.onEvent($RenderLivingEvent$Pre, event => {
		const entity = event.getEntity();
		if (isInvisible(entity)) {
			event.getRenderer().shadowRadius = 0.0;
			event.setCanceled(true);
		}
		else {
			event.getRenderer().shadowRadius = 0.5;
		}
	});

	NativeEvents.onEvent($RenderNameTagEvent, event => {
		const entity = event.getEntity();
		if (isInvisible(entity)) {
			event.setCanRender("false");
		}
	});
}