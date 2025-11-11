

namespace OnLoad.Gamerules {

	const gamerules: [string, boolean | integer][] = [
		["commandBlockOutput", false]
	];

	const mobGriefingDimensions: string[] = [
		"minecraft:overworld"
	];

	const noGriefingMobs: string[] = [
		"minecraft:creeper",
		"minecraft:wither",
		"minecraft:ghast"
	];

	OnLoadManager.INSTANCE.addListener(server => {
		for (const [id, value] of gamerules) {
			ServerHelper.setGamerule(server, id, value);
		}

		const dimensions = ServerHelper.getAllDimensions(server);
		for (const dimension of dimensions) {
			let value: boolean | integer | "clear!";
			if (mobGriefingDimensions.indexOf(dimension) !== -1) {
				value = "clear!";
			}
			else {
				value = false;
			}

			ServerHelper.setPDGamerule(server, dimension, "mobGriefing", value);
		}
	});
}