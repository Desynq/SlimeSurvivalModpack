// priority: 2

class BossDirector {
	/**
	 * Defaults to true on server start/reload
	 */
	private static needsGlobalRebuild: boolean = true;

	public static tryGlobalCacheRebuild(server: MinecraftServer_): boolean {
		if (!this.needsGlobalRebuild) return false;

		this.needsGlobalRebuild = false;

		for (const entity of server.getEntities()) {
			for (const manager of this.managers) {
				manager.tryCacheBoss(entity);
			}
		}

		return true;
	}


	public static readonly managers: BossManager<any>[] = [];

	public static addManager(manager: BossManager<any>): void {
		this.managers.push(manager);
	}

	public static isTickManager(manager: BossManager<any>): manager is BossManager<any> & ITickableBoss<any> {
		return "onBossTick" in manager;
	}

	public static isCustomBossbarManager(manager: BossManager<any>): manager is BossManager<any> & ICustomBossbar<any> {
		return "onBossbarUpdate" in manager;
	}

	public static isBoss(entity: unknown): boolean {
		return this.managers.some(manager => manager.isBoss(entity));
	}

	public static isCachedBoss(entity: unknown): boolean {
		return this.managers.some(manager => manager.isCachedBoss(entity));
	}

	public static hasCustomBossbar(entity: Entity_): boolean {
		const manager = BossManagerRegistry.getManager(entity);
		return manager !== undefined && this.isCustomBossbarManager(manager);
	}

	public static tryAddBoss(boss: Entity_): boolean {
		for (const manager of this.managers) {
			if (manager.tryCacheBoss(boss)) return true;
		}
		return false;
	}

	public static eventHook(boss: Entity_, event: any): void {
		const manager = BossManagerRegistry.getManager(boss);
		if (!manager) return;

		if (event instanceof $EntitySpawnedKubeEvent) manager.onSpawn(boss, event);
		else if (event instanceof $LivingEntityDeathKubeEvent) manager.onDeath(boss, event);
		else if (event instanceof $EntityLeaveLevelEvent) manager.onLeave(boss, event);
		else if (event instanceof $LivingIncomingDamageEvent) manager.onIncomingDamage(boss, event);
	}

	public static pruneBossbars(server: MinecraftServer_) {
		const bossbars = server.customBossEvents;

		for (const bossbar of bossbars.getEvents().toArray() as CustomBossEvent_[]) {
			const uuid = UUID.fromString(bossbar.textId.path);
			const entity = server.getEntityByUUID(uuid.toString());
			if (!BossManager.isGenericBoss(entity) || (TheHunger.isCachedBoss(entity) && !TheHunger.isBossbarHolder(entity))) {
				bossbar.removeAllPlayers();
				bossbars.remove(bossbar);
			}
		}
	}

	public static genericBossTick(boss: LivingEntity_): void {
		if (boss.tags.contains("boss.voidman")) {
			VoidmanBoss.tick(boss);
		}
		else if (boss instanceof $ServerPlayer && boss.tags.contains("boss.the_hunter")) {
			TheHunter.tick(boss);
		}

		if (!this.hasCustomBossbar(boss)) {
			this.createOrUpdateBossbar(boss);
		}
	}

	public static tickAll(server: MinecraftServer_): void {
		for (const manager of this.managers) {
			manager.onServerTick(server);

			manager.verifyBossCache();
			if (manager.getBossCount(server) === 0) continue;

			const bosses = manager.getBosses(server);
			manager.onTickAll(server, bosses);

			const isTickable = this.isTickManager(manager);
			const hasCustomBossbar = this.isCustomBossbarManager(manager);
			if (!isTickable && !hasCustomBossbar) continue;

			for (const boss of bosses) {
				if (isTickable) manager.onBossTick(boss);
				if (hasCustomBossbar) manager.onBossbarUpdate(boss);
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
	}
}