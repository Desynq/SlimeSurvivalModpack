
namespace CustomMobSpawns {
	const spawnTable = {};

	spawnTable["minecraft:chicken"] = new Map([
		['mowziesmobs:umvuthana_raptor', 25.00]
	]);

	spawnTable["minecraft:zombie"] = new Map([
		['rottencreatures:zombie_lackey', 10.00],
		['minecraft:zombie_villager', 50.00],
		['rottencreatures:frostbitten', 5.00],
		['rottencreatures:burned', 5.00]
	]);

	spawnTable["minecraft:skeleton"] = new Map([
		['rottencreatures:skeleton_lackey', 10.00],
	]);

	spawnTable["minecraft:slime"] = new Map([
		['mowziesmobs:umvuthana_raptor', 0.20],
		// ['cataclysm:coralssus', 0.005],
		// ['cataclysm:aptrgangr', 0.005],
		['mowziesmobs:lantern', 5.00],
		['minecraft:armadillo', 0.50],
		// ['cataclysm:kobolediator', 0.005],
		['cataclysm:cindaria', 0.10],
	]);
	// cataclysm:koboleton
	spawnTable["cataclysm:koboleton"] = new Map([
		['cataclysm:kobolediator', 0.50],
		['cataclysm:modern_remnant', 25.00]
	]);

	spawnTable["minecraft:pig"] = new Map([
		['mutantmonsters:spider_pig', 0.50]
	]);
	spawnTable["minecraft:spider"] = new Map([
		['mutantmonsters:spider_pig', 0.50]
	]);

	Object.keys(spawnTable).forEach(key => {
		EntityEvents.checkSpawn(key as any, event => {
			if (event.type.toString() !== "NATURAL") return;
			const entity = event.getEntity();
			const pos = entity.getPosition(0);
			const level = entity.level;
			const mobToSpawn = roll(spawnTable[key]);
			if (mobToSpawn) {
				CommandHelper.runCommandSilent(level, `summon ${mobToSpawn} ${pos.x()} ${pos.y()} ${pos.z()}`);
				event.cancel();
			}
		});
	});

	/** @param {Map<string, number>} list */
	function roll(list) {
		let centumDice = Math.random() * 100;
		let candidates = [];
		let minChance = 101.0;

		list.forEach((chance, mob) => {
			// @ts-ignore
			let chanceFloat = parseFloat(chance);
			if (chanceFloat < minChance) {
				minChance = chanceFloat;
			}
			if ((100.0 - chanceFloat) <= centumDice) {
				// @ts-ignore
				candidates.push([mob, chanceFloat]);
			}
		});


		if (candidates.length === 0) {
			return false;
		}

		// Sort by chance (ascending)
		candidates.sort(function (a, b) { return a[1] - b[1]; });
		return candidates[0][0];
	}
}

class SpawnTable {

	public constructor(
		private readonly defaultType: string,
		private readonly maxWeight: number
	) { }
}