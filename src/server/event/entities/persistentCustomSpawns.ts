
/** @type {typeof import("net.minecraft.world.entity.MobSpawnType").$MobSpawnType } */
let $MobSpawnType = Java.loadClass("net.minecraft.world.entity.MobSpawnType");

namespace PersistentCustomSpawnsManager {
	const PERSISTENT_SPAWN_TYPES: import("net.minecraft.world.entity.MobSpawnType").$MobSpawnType[] = [$MobSpawnType.SPAWN_EGG, $MobSpawnType.SPAWNER, $MobSpawnType.TRIAL_SPAWNER];

	NativeEvents.onEvent($MobDespawnEvent, event => {
		const mob = event.entity as Mob_;

		if (mob.persistenceRequired || mob.requiresCustomPersistence()) return;

		const spawnType = mob.spawnType;
		if (event.level.getDifficulty() !== $Difficulty.PEACEFUL && PERSISTENT_SPAWN_TYPES.indexOf(spawnType) !== -1) {
			event.setResult("deny");
		}
	});
}