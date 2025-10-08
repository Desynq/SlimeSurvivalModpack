

let invisiblePlayersPacket: CompoundTag_ | undefined;
NetworkEvents.dataReceived("InvisiblePlayers", event => {
	invisiblePlayersPacket = event.data;
});

NativeEvents.onEvent($RenderLivingEvent$Pre, event => {
	const entity = event.getEntity();
	if (entity instanceof $Player) {
		const isInvisible: boolean = invisiblePlayersPacket?.getBoolean(entity.stringUUID) ?? false;
		if (isInvisible) {
			event.setCanceled(true);
		}
	}
});