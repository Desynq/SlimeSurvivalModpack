

namespace RecipeInfoImpl {
	RecipeViewerEvents.addInformation("item", event => {
		event.add("twilightforest:liveroot", [
			"Can be obtained by breaking rooted dirt. Chance is increased with fortune."
		]);

		for (const item of ["minecraft:turtle_scute", "slimesurvival:axolotl_gills"]) {
			event.add(item, [
				"Can be obtained as a rare treasure drop from fishing."
			]);
		}
	});
}