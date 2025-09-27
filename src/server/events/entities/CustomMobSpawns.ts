
namespace CustomMobSpawns {
	const spawnTable = {};

	spawnTable["minecraft:chicken"] = new Map([
		['mowziesmobs:umvuthana_raptor', 25]
	]);

	spawnTable["minecraft:zombie"] = new Map([
		['rottencreatures:zombie_lackey', 10],
		['rottencreatures:frostbitten', 10],
		['rottencreatures:burned', 10]
	]);

	spawnTable["minecraft:skeleton"] = new Map([
		['rottencreatures:skeleton_lackey', 10.00],
	]);

	spawnTable["minecraft:slime"] = new Map([
		// ['cataclysm:coralssus', 0.005],
		// ['cataclysm:aptrgangr', 0.005],
		['mowziesmobs:lantern', 5],
		// ['cataclysm:kobolediator', 0.005],
		['cataclysm:cindaria', 1],
	]);
	// cataclysm:koboleton
	spawnTable["cataclysm:koboleton"] = new Map([
		['cataclysm:kobolediator', 0.50],
		['cataclysm:modern_remnant', 25.00],
	]);

	spawnTable["minecraft:pig"] = new Map([
		['mutantmonsters:spider_pig', 0.50],
		['minecraft:armadillo', 2.00],
	]);
	spawnTable["minecraft:spider"] = new Map([
		['mutantmonsters:spider_pig', 0.50],
	]);

	Object.keys(spawnTable).forEach(key => {
		EntityEvents.checkSpawn(key, event => {
			if (event.type.toString() !== "NATURAL") return;

			const entity = event.getEntity();
			const pos = entity.getPosition(0);
			const level = entity.level;
			const mobToSpawn = roll(spawnTable[key], 100);
			if (mobToSpawn) {
				CommandHelper.runCommandSilent(level, `summon ${mobToSpawn} ${pos.x()} ${pos.y()} ${pos.z()}`);
				event.cancel();
			}
		});
	});

	function roll(table: Map<string, number>, maxWeight = 0): string | null {
		const entries: [string | null, number][] = Object.entries(table);
		const totalWeight = entries.reduce((sum, [, w]) => sum + w, 0);

		if (totalWeight < maxWeight) {
			entries.push([null, maxWeight - totalWeight]);
		}

		const roll = Math.random() * totalWeight;
		let cumulative = 0;
		for (const [mob, weight] of entries) {
			cumulative += weight;
			if (roll <= cumulative) {
				return mob;
			}
		}
		return null;
	}
}

class SpawnTable {

	public constructor(
		private readonly defaultType: string,
		private readonly maxWeight: number
	) { }
}