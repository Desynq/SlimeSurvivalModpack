/** @type {typeof import("io.github.desynq.slimesurvival.event.NaturalRegenerationCheckEvent").$NaturalRegenerationCheckEvent } */
let $NaturalRegenerationCheckEvent = Java.loadClass("io.github.desynq.slimesurvival.event.NaturalRegenerationCheckEvent");

NativeEvents.onEvent($NaturalRegenerationCheckEvent, event => {
	if (event.getEntity().getTags().stream().anyMatch(tag => tag.endsWith("no_natural_regeneration"))) {
		event.setCanceled(true);
	}
});