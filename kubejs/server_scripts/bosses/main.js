const BOSSBAR_ID_DESYNQ = "slimesurvival:desynq"




ServerEvents.tick(event => {
	pruneBossbars(event.server);
	event.server.entities.forEach(entity => {
		if (entity instanceof $LivingEntity && entity.tags.contains("boss")) {
			bossTick(entity);
		}
	});
});



PlayerEvents.tick(event => {
	const { player } = event;
	if (player.tags.contains("boss")) {
		bossTick(player);
	}
});



/**
 * 
 * @param {import("net.minecraft.server.MinecraftServer").$MinecraftServer$$Original} server 
 */
function pruneBossbars(server) {
	const bossbarManager = server.customBossEvents;
	const bossbars = bossbarManager.events;
	bossbars.forEach(bossbar => {
		let uuid = UUID.fromString(bossbar.textId.path);
		let entity = server.getEntityByUUID(uuid);
		if (entity == null) {
			bossbar.removeAllPlayers();
			bossbars.remove(bossbar);
		}
	});
}


/**
 * 
 * @param {$LivingEntity_} bossEntity
 */
function bossTick(bossEntity) {
	const server = bossEntity.server;
	const bossbarManager = server.customBossEvents;

	const bossbarId = `boss:${bossEntity.uuid.toString()}`;
	const scoreboardName = EntityHelper.getScoreboardName(bossEntity);

	if (bossbarManager.get(bossbarId) == null) {
		server.runCommandSilent(`bossbar add ${bossbarId} ""`);
	}

	server.runCommandSilent(`bossbar set ${bossbarId} max ${Math.ceil(bossEntity.maxHealth)}`);
	server.runCommandSilent(`bossbar set ${bossbarId} value ${Math.floor(bossEntity.health)}`);
	server.runCommandSilent(`bossbar set ${bossbarId} name [{"selector":"${scoreboardName}"},{"color":"gray","text":" ${bossEntity.health.toFixed(2)}/${bossEntity.maxHealth.toFixed(2)}"}]`);
	server.runCommandSilent(`execute at ${scoreboardName} run bossbar set ${bossbarId} players @a[distance=0..]`);
}