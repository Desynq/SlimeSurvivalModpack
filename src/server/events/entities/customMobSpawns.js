const spawnTable = {};

spawnTable.chicken = new Map([
	['mowziesmobs:umvuthana_raptor', 25.00]
]);

spawnTable.zombie = new Map([
	['rottencreatures:zombie_lackey', 20.00],
	['minecraft:zombie_villager', 50.00],
	['rottencreatures:frostbitten', 5.00],
	['rottencreatures:burned', 5.00]
]);

spawnTable.skeleton = new Map([
	['rottencreatures:skeleton_lackey', 20.00],
]);

spawnTable.slime = new Map([
	['mowziesmobs:umvuthana_raptor', 1.00],
	['cataclysm:clawdian', 0.05],
	['cataclysm:coralssus', 0.05],
	['cataclysm:aptrgangr', 0.05],
	['mowziesmobs:lantern', 10.00],
	['minecraft:armadillo', .50],
	['cataclysm:kobolediator', 0.05],
	['cataclysm:cindaria', 0.25],
]);
// cataclysm:koboleton
spawnTable.koboleton = new Map([
	['cataclysm:kobolediator', 0.50],
	['cataclysm:modern_remnant', 25.00]
]);

spawnTable.pig = new Map([
	['mutantmonsters:spider_pig', 0.50]
]);
spawnTable.spider = new Map([
	['mutantmonsters:spider_pig', 0.50]
]);

EntityEvents.checkSpawn("minecraft:zombie", event => {
	if (event.type.toString() !== "NATURAL") return;
	const entity = event.getEntity()

	const pos = entity.getPosition(0)
	const level = entity.level
	const mobToSpawn = roll(spawnTable.zombie);
	if (mobToSpawn) {
		CommandHelper.runCommandSilent(level, `summon ${mobToSpawn} ${pos.x()} ${pos.y()} ${pos.z()}`);
		event.cancel();
	}
})

EntityEvents.checkSpawn("minecraft:skeleton", event => {
	if (event.type.toString() !== "NATURAL") return;
	const entity = event.getEntity()

	const pos = entity.getPosition(0)
	const level = entity.level
	const mobToSpawn = roll(spawnTable.skeleton);
	if (mobToSpawn) {
		CommandHelper.runCommandSilent(level, `summon ${mobToSpawn} ${pos.x()} ${pos.y()} ${pos.z()}`);
		event.cancel();
	}
})

EntityEvents.checkSpawn("minecraft:slime", event => {
	if (event.type.toString() !== "NATURAL") return;
	const entity = event.getEntity();

	const pos = entity.getPosition(0);
	const level = entity.level;
	const mobToSpawn = roll(spawnTable.slime);
	if (mobToSpawn) {
		CommandHelper.runCommandSilent(level, `summon ${mobToSpawn} ${pos.x()} ${pos.y()} ${pos.z()}`);
		event.cancel();
	}
});

EntityEvents.checkSpawn("minecraft:chicken", event => {
	if (event.type.toString() !== "NATURAL") return;
	const entity = event.getEntity();
	const pos = entity.getPosition(0);
	const level = entity.level;
	const mobToSpawn = roll(spawnTable.chicken);
	if (mobToSpawn) {
		CommandHelper.runCommandSilent(level, `summon ${mobToSpawn} ${pos.x()} ${pos.y()} ${pos.z()}`);
		event.cancel();
	}
});

EntityEvents.checkSpawn("minecraft:pig", event => {
	if (event.type.toString() !== "NATURAL") return;
	const entity = event.getEntity();
	const pos = entity.getPosition(0);
	const level = entity.level;
	const mobToSpawn = roll(spawnTable.pig);
	if (mobToSpawn) {
		CommandHelper.runCommandSilent(level, `summon ${mobToSpawn} ${pos.x()} ${pos.y()} ${pos.z()}`);
		event.cancel();
	}
});
EntityEvents.checkSpawn("minecraft:spider", event => {
	if (event.type.toString() !== "NATURAL") return;
	const entity = event.getEntity();
	const pos = entity.getPosition(0);
	const level = entity.level;
	const mobToSpawn = roll(spawnTable.spider);
	if (mobToSpawn) {
		CommandHelper.runCommandSilent(level, `summon ${mobToSpawn} ${pos.x()} ${pos.y()} ${pos.z()}`);
		event.cancel();
	}
});

EntityEvents.checkSpawn("cataclysm:koboleton", event => {
	if (event.type.toString() !== "NATURAL") return;
	const entity = event.getEntity();
	const pos = entity.getPosition(0);
	const level = entity.level;
	const mobToSpawn = roll(spawnTable.koboleton);
	if (mobToSpawn) {
		CommandHelper.runCommandSilent(level, `summon ${mobToSpawn} ${pos.x()} ${pos.y()} ${pos.z()}`);
		event.cancel();
	}
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
			candidates.push([mob, chanceFloat]);
		}
	});


	if (candidates.length === 0) {
		return false;
	}

	// Sort by chance (ascending)
	candidates.sort(function(a, b) { return a[1] - b[1]; });
	return candidates[0][0];
}