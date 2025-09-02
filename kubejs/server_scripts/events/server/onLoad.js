ServerEvents.loaded(event => OnLoad.run(event.server));



const OnLoad = {};

/**
 * 
 * @param {$MinecraftServer_} server 
 */
OnLoad.run = function (server) {
	const customBossEvents = server.customBossEvents;
	if (customBossEvents.get(BOSSBAR_ID_DESYNQ) == null) {
		server.runCommandSilent(`bossbar add ${BOSSBAR_ID_DESYNQ} ""`);
	}
}


NativeEvents.onEvent($ServerReloadedEvent, event => {
	OnLoad.run(event.server);
})