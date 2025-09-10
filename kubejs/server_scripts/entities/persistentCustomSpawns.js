/** @type {typeof import("net.minecraft.world.entity.MobSpawnType").$MobSpawnType } */
let $MobSpawnType = Java.loadClass("net.minecraft.world.entity.MobSpawnType")

const PERSISTENT_SPAWN_TYPES = [$MobSpawnType.SPAWN_EGG, $MobSpawnType.SPAWNER, $MobSpawnType.TRIAL_SPAWNER];

EntityEvents.checkSpawn(event => {
	const server = event.server;
	const entity = event.entity;
	$TaskScheduler.scheduleTask(server, 1, () => {
		if (PERSISTENT_SPAWN_TYPES.indexOf(event.type) === -1) {
			return;
		}
		CommandHelper.runCommandSilent(event.server, `data modify entity ${entity.username} PersistenceRequired set value true`);
	});
});