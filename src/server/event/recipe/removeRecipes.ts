

namespace RemoveRecipes {
	const removedRecipes: string[] = [
		"createdieselgenerators:crafting/hammer",
		"create:crafting/materials/andesite_alloy",
		"create:crafting/kinetics/water_wheel",
		"create:crafting/kinetics/encased_fan",
		"dndesires:crafting/industrial_fan"
	];

	ServerEvents.recipes(event => {
		for (const recipe of removedRecipes) {
			event.remove(recipe as any);
		}
	});
}