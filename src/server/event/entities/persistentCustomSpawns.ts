
namespace PersistentCustomSpawnsManager {
	const PERSISTENT_SPAWN_TYPES: import("net.minecraft.world.entity.MobSpawnType").$MobSpawnType[] = [$MobSpawnType.SPAWN_EGG, $MobSpawnType.SPAWNER, $MobSpawnType.TRIAL_SPAWNER];

	NativeEvents.onEvent($MobDespawnEvent, event => {
		const mob = event.entity as Mob_;

		if (mob.tags.contains("despawnable")) {
			// TODO: steal vanilla source implementation from checkDespawn()
			event.setResult("deny");
			return;
		}

		if (mob.persistenceRequired || mob.requiresCustomPersistence()) return;

		const spawnType = mob.spawnType;
		if (event.level.getDifficulty() !== $Difficulty.PEACEFUL && PERSISTENT_SPAWN_TYPES.indexOf(spawnType) !== -1) {
			event.setResult("deny");
			return;
		}
	});

	const pendingRemoval = new Set<string>();

	NativeEvents.onEvent($EntityLeaveLevelEvent, event => {
		const entity = event.entity;

		if (isDespawnOnLeave(entity)) {
			pendingRemoval.add(entity.stringUUID);
		}
	});

	ServerEvents.tick(event => {
		pendingRemoval.forEach(uuid => {
			const entity = event.server.getEntityByUUID(uuid);
			if (entity && !entity.removed) {
				entity.remove("discarded");
			}
		});
		pendingRemoval.clear();
	});

	function isDespawnOnLeave(entity: Entity_): boolean {
		if (!(entity instanceof $Mob)) return false;
		const type = EntityHelper.getType(entity);

		return type === "cataclysm:cindaria" && !entity.requiresCustomPersistence();
	}
}