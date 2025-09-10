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
 * @param {LivingEntity} boss
 */
function bossTick(boss) {
	if (boss.tags.contains("boss.tenuem")) {
		TenuemBoss.tick(boss);
	}

	const server = boss.server;
	const bossbarManager = server.customBossEvents;

	const bossbarId = `boss:${boss.uuid.toString()}`;

	if (bossbarManager.get(bossbarId) == null) {
		server.runCommandSilent(`bossbar add ${bossbarId} ""`);
	}

	server.runCommandSilent(`bossbar set ${bossbarId} max ${Math.ceil(boss.maxHealth)}`);
	server.runCommandSilent(`bossbar set ${bossbarId} value ${Math.floor(boss.health)}`);
	server.runCommandSilent(`bossbar set ${bossbarId} name [{"selector":"${boss.username}"},{"color":"gray","text":" ${boss.health.toFixed(2)}/${boss.maxHealth.toFixed(2)}"}]`);
	server.runCommandSilent(`execute at ${boss.username} run bossbar set ${bossbarId} players @a[distance=0..]`);
}