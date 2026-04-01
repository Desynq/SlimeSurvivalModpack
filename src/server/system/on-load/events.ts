// priority: -1

namespace OnLoadHook {
	ServerEvents.loaded(event => onLoad(event.server));

	NativeEvents.onEvent($ServerReloadedEvent, event => {
		onLoad(event.server);
	});

	function onLoad(server: MinecraftServer_ | null) {
		if (server === null) return;
		OnLoadManager.INSTANCE.onLoad(server);
	}
}