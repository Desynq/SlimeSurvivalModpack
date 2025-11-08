NativeEvents.onEvent($NaturalRegenerationCheckEvent, event => {
	if (event.getEntity().getTags().stream().anyMatch(tag => tag.endsWith("no_natural_regeneration"))) {
		event.setCanceled(true);
	}
});