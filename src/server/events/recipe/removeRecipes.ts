

ServerEvents.recipes(event => {
	event.remove("createdieselgenerators:crafting/hammer" as any);

	event.remove("create:crafting/materials/andesite_alloy" as any);
});