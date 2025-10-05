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



abstract class BossManager<T extends LivingEntity_> {
	private bossCache: EntityCache<T> = new EntityCache();

	public static isGenericBoss(entity: unknown): entity is LivingEntity_ {
		return entity instanceof $LivingEntity
			&& entity.tags.stream().anyMatch(tag => tag.startsWith("boss."));
	}

	/**
	 * Used for caching. Actual boss detection should use {@link isCachedBoss}
	 */
	public abstract isBoss(entity: unknown): entity is T;

	public isCachedBoss(entity: unknown): entity is T {
		return this.bossCache.isCached(entity);
	}

	public register(): this {
		BossDirector.addManager(this);
		return this;
	}

	public onSpawn(boss: T, event: EntitySpawnedKubeEvent_): void {
	}

	public onDeath(boss: T, event: LivingEntityDeathKubeEvent_): void {
	}

	public onPlayerDeath(player: ServerPlayer_, event: LivingEntityDeathKubeEvent_): void {
	}

	public onIncomingDamage(boss: T, event: LivingIncomingDamageEvent_): void {
	}

	public onJoin(boss: T, event: EntityJoinLevelEvent_): void {
		this.bossCache.add(boss);
	}

	public onLeave(boss: T, event: EntityLeaveLevelEvent_): void {
		this.bossCache.remove(boss);
	}

	private lazyLoadBossCache(server: MinecraftServer_): void {
		if (this.bossCache.count > 0) return;

		for (const e of server.getEntities()) {
			if (!this.isBoss(e)) continue;
			this.bossCache.add(e);
		}
	}

	public getBosses(server: MinecraftServer_): T[] {
		this.lazyLoadBossCache(server);
		return this.bossCache.entities;
	}

	public getBossCount(server: MinecraftServer_): integer {
		this.lazyLoadBossCache(server);
		return this.bossCache.count;
	}

	public hasBoss(): boolean {
		return this.bossCache.count > 0;
	}
}

interface TickableBoss<T> {
	onBossTick(boss: T): void;
}

interface CustomBossbar<T> {
	onBossbarUpdate(boss: T): void;
}

class BossDirector {

	public static readonly managers: BossManager<any>[] = [];
	public static readonly tickManagers: (BossManager<any> & TickableBoss<any>)[] = [];
	public static readonly customBossbarManagers: (BossManager<any> & CustomBossbar<any>)[] = [];

	public static addManager(manager: BossManager<any>): void {
		this.managers.push(manager);
		if ("onBossTick" in manager) {
			this.tickManagers.push(manager as BossManager<any> & TickableBoss<any>);
		}
		if ("onBossbarUpdate" in manager) {
			this.customBossbarManagers.push(manager as BossManager<any> & CustomBossbar<any>);
		}
	}

	public static isBoss(entity: unknown): boolean {
		return this.managers.some(manager => manager.isBoss(entity));
	}

	public static isCachedBoss(entity: unknown): boolean {
		return this.managers.some(manager => manager.isCachedBoss(entity));
	}

	public static hasCustomBossbar(entity: unknown): boolean {
		return this.customBossbarManagers.some(manager => manager.isCachedBoss(entity));
	}

	public static eventHook(boss: Entity_, event: any): void {
		for (const manager of this.tickManagers) {
			if (!manager.isCachedBoss(boss)) continue;

			if (event instanceof $EntitySpawnedKubeEvent) manager.onSpawn(boss, event);
			else if (event instanceof $LivingEntityDeathKubeEvent) manager.onDeath(boss, event);
			else if (event instanceof $EntityLeaveLevelEvent) manager.onLeave(boss, event);
			else if (event instanceof $LivingIncomingDamageEvent) manager.onIncomingDamage(boss, event);
			break;
		}
	}

	public static pruneBossbars(server: MinecraftServer_) {
		const bossbars = server.customBossEvents;

		for (const bossbar of bossbars.getEvents().toArray() as CustomBossEvent_[]) {
			const uuid = UUID.fromString(bossbar.textId.path);
			const entity = server.getEntityByUUID(uuid.toString());
			if (!BossManager.isGenericBoss(entity)
				|| (TheHunger.isCachedBoss(entity) && !TheHunger.isBossbarHolder(entity))
			) {
				bossbar.removeAllPlayers();
				bossbars.remove(bossbar);
			}
		}
	}

	public static bossTick(boss: LivingEntity_): void {
		if (boss.tags.contains("boss.tenuem")) {
			TenuemBoss.tick(boss);
		}
		else if (boss.tags.contains("boss.voidman")) {
			VoidmanBoss.tick(boss);
		}
		else if (boss instanceof $ServerPlayer && boss.tags.contains("boss.the_hunter")) {
			TheHunter.tick(boss);
		}

		if (!this.hasCustomBossbar(boss)) this.createOrUpdateBossbar(boss);
	}

	public static tickAll(server: MinecraftServer_): void {
		for (const manager of this.tickManagers) {
			for (const boss of manager.getBosses(server)) {
				manager.onBossTick(boss);
			}
		}
		for (const manager of this.customBossbarManagers) {
			for (const boss of manager.getBosses(server)) {
				manager.onBossbarUpdate(boss);
			}
		}
	}

	private static createOrUpdateBossbar(boss: LivingEntity_): void {
		const server = boss.server;
		const bossbarManager = server.customBossEvents;

		const bossbarId = `boss:${boss.uuid.toString()}`;

		if (bossbarManager.get(bossbarId) == null) {
			server.runCommandSilent(`bossbar add ${bossbarId} ""`);
		}

		server.runCommandSilent(`bossbar set ${bossbarId} max ${Math.ceil(boss.maxHealth)}`);
		server.runCommandSilent(`bossbar set ${bossbarId} value ${Math.floor(boss.health)}`);

		if (boss instanceof $ServerPlayer) {
			this.updatePlayerBossbar(boss, bossbarId);
		}
		else {
			server.runCommandSilent(`bossbar set ${bossbarId} name [{"selector":"${boss.username}"},{"color":"gray","text":" ${boss.health.toFixed(2)}/${boss.maxHealth.toFixed(2)}"}]`);
		}

		server.runCommandSilent(`execute at ${boss.username} run bossbar set ${bossbarId} players @a[distance=0..]`);
	}

	private static updatePlayerBossbar(boss: ServerPlayer_, bossbarId: string): void {
		const customName = boss.persistentData.getString("custom_name");
		if (customName === "") {
			boss.server.runCommandSilent(`bossbar set ${bossbarId} name [{"selector":"${boss.username}"},{"color":"gray","text":" ${boss.health.toFixed(2)}/${boss.maxHealth.toFixed(2)}"}]`);
		}
		else {
			boss.server.runCommandSilent(`bossbar set ${bossbarId} name [${customName},{"color":"gray","text":" ${boss.health.toFixed(2)}/${boss.maxHealth.toFixed(2)}"}]`);
		}
		// @ts-ignore
		boss.cooldowns.removeCooldown("minecraft:spyglass");
	}
}

ServerEvents.tick(event => {
	BossDirector.pruneBossbars(event.server);
	BossDirector.tickAll(event.server);
});



EntityEvents.spawned(event => {
	BossDirector.eventHook(event.entity, event);
});

EntityEvents.death(event => {
	BossDirector.eventHook(event.entity, event);

	if (event.entity instanceof $ServerPlayer) {
		for (const manager of BossDirector.managers) {
			if (manager.hasBoss()) {
				manager.onPlayerDeath(event.entity, event);
				break;
			}
		}
	}
});

NativeEvents.onEvent($EntityJoinLevelEvent, event => {
	for (const manager of BossDirector.managers) {
		if (manager.isBoss(event.entity)) {
			manager.onJoin(event.entity, event);
			break;
		}
	}
});

NativeEvents.onEvent($EntityLeaveLevelEvent, event => {
	BossDirector.eventHook(event.entity, event);
});

NativeEvents.onEvent($LivingIncomingDamageEvent, event => {
	BossDirector.eventHook(event.entity, event);
});



NativeEvents.onEvent($EntityTickEvent$Pre, event => {
	const entity = event.entity;
	if (BossManager.isGenericBoss(entity)) {
		BossDirector.bossTick(entity);
	}
});