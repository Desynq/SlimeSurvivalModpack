// priority: 1

/** In case something goes horribly wrong, call this using `/eval "nukeBossbars(source.server)"`.
 * 
 */
function nukeBossbars(server: MinecraftServer_) {
	const bossEvents = server.getCustomBossEvents();
	for (const event of bossEvents.getEvents().toArray() as CustomBossEvent_[]) {
		event.removeAllPlayers();
		bossEvents.remove(event);
	}
}



abstract class BossManager<T> {

	public static isBoss(entity: unknown): entity is LivingEntity_ {
		return entity instanceof $LivingEntity && entity.tags.stream().anyMatch(tag => tag.startsWith("boss."));
	}

	public abstract isBoss(entity: unknown): entity is T;
	public register(): this {
		BossDirector.addManager(this);
		return this;
	}
}

interface TickableBoss<T> {
	onBossTick(boss: T): void;
}

class BossDirector {

	private static managers: BossManager<any>[] = [];
	private static tickManagers: (BossManager<any> & TickableBoss<any>)[] = [];

	public static addManager(manager: BossManager<any>): void {
		this.managers.push(manager);
		if ("onBossTick" in manager) {
			this.tickManagers.push(manager as BossManager<any> & TickableBoss<any>);
		}
	}

	public static pruneBossbars(server: MinecraftServer_) {
		const bossbars = server.customBossEvents;

		for (const bossbar of bossbars.getEvents().toArray() as CustomBossEvent_[]) {
			const uuid = UUID.fromString(bossbar.textId.path);
			const entity = server.getEntityByUUID(uuid.toString());
			if (!BossManager.isBoss(entity)) {
				bossbar.removeAllPlayers();
				bossbars.remove(bossbar);
			}
		}
	}

	public static bossTick(boss: LivingEntity_) {
		for (const manager of this.tickManagers) {
			if (manager.isBoss(boss)) {
				manager.onBossTick(boss);
			}
		}

		if (boss.tags.contains("boss.tenuem")) {
			TenuemBoss.tick(boss);
		}
		if (boss.tags.contains("boss.voidman")) {
			VoidmanBoss.tick(boss);
		}
		if (boss instanceof $ServerPlayer && boss.tags.contains("boss.the_hunter")) {
			TheHunter.tick(boss);
		}

		const server = boss.server;
		const bossbarManager = server.customBossEvents;

		const bossbarId = `boss:${boss.uuid.toString()}`;

		if (bossbarManager.get(bossbarId) == null) {
			server.runCommandSilent(`bossbar add ${bossbarId} ""`);
		}

		server.runCommandSilent(`bossbar set ${bossbarId} max ${Math.ceil(boss.maxHealth)}`);
		server.runCommandSilent(`bossbar set ${bossbarId} value ${Math.floor(boss.health)}`);

		if (boss instanceof $ServerPlayer) {
			const customName = boss.persistentData.getString("custom_name");
			if (customName === "") {
				server.runCommandSilent(`bossbar set ${bossbarId} name [{"selector":"${boss.username}"},{"color":"gray","text":" ${boss.health.toFixed(2)}/${boss.maxHealth.toFixed(2)}"}]`);
			}
			else {
				server.runCommandSilent(`bossbar set ${bossbarId} name [${customName},{"color":"gray","text":" ${boss.health.toFixed(2)}/${boss.maxHealth.toFixed(2)}"}]`);
			}
			// @ts-ignore
			boss.cooldowns.removeCooldown("minecraft:spyglass");
		}
		else {
			server.runCommandSilent(`bossbar set ${bossbarId} name [{"selector":"${boss.username}"},{"color":"gray","text":" ${boss.health.toFixed(2)}/${boss.maxHealth.toFixed(2)}"}]`);
		}

		server.runCommandSilent(`execute at ${boss.username} run bossbar set ${bossbarId} players @a[distance=0..]`);
	}
}

ServerEvents.tick(event => {
	BossDirector.pruneBossbars(event.server);
});

NativeEvents.onEvent($EntityTickEvent$Pre, event => {
	const entity = event.entity;
	if (BossManager.isBoss(entity)) {
		BossDirector.bossTick(entity);
	}
});

EntityEvents.death("minecraft:player", event => {
	event.server.getEntities() // @ts-ignore
		.filter((e: Entity_) => e instanceof $Bee && e.tags.contains("boss.queen_bee"))
		.forEach(e => {
			QueenBee.onPlayerDeath(e as any, event.entity as any);
		});
});