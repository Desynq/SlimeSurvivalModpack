/** @type {typeof import("net.minecraft.world.entity.MobSpawnType").$MobSpawnType } */
let $MobSpawnType = Java.loadClass("net.minecraft.world.entity.MobSpawnType")

EntityEvents.checkSpawn(event => {
	const server = event.server;
	const entity = event.entity;
	$TaskScheduler.scheduleTask(server, 1, () => {
		if (event.type !== $MobSpawnType.SPAWN_EGG) {
			return;
		}
		CommandHelper.runCommandSilent(event.server, `data modify entity ${entity.username} PersistenceRequired set value true`);
	});
});