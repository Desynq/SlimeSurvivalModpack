ServerEvents.loaded(event => new OnLoad(event.server));



function OnLoad(server) {
	this.server = server;
}


NativeEvents.onEvent($ServerReloadedEvent, event => {
	new OnLoad(event.server);
})