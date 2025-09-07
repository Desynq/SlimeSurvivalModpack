ServerEvents.loaded(event => OnLoad.run(event.server));



const OnLoad = {};

/**
 * 
 * @param {$MinecraftServer_} server 
 */
OnLoad.run = function (server) {
}


NativeEvents.onEvent($ServerReloadedEvent, event => {
	OnLoad.run(event.server);
})