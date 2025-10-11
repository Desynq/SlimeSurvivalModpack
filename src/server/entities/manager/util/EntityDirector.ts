// priority: 2

class EntityDirector {
	/**
	 * Defaults to true on server start/reload
	 */
	private static needsGlobalRebuild: boolean = true;

	/**
	 * Tries to rebuild the entity cache of every entity manager if the server just reloaded or started.
	 * @returns `true` if the cache of all managers could be rebuilt, `false` otherwise.
	 */
	public static tryGlobalCacheRebuild(server: MinecraftServer_): boolean {
		if (!this.needsGlobalRebuild) return false;

		this.needsGlobalRebuild = false;

		for (const entity of server.getEntities()) {
			if (entity instanceof $LivingEntity) {
				for (const manager of this.managers) {
					manager.tryCacheEntity(entity);
				}
			}
		}

		return true;
	}


	public static readonly managers: EntityManager<LivingEntity_>[] = [];

	public static addManager(manager: EntityManager<LivingEntity_>): void {
		this.managers.push(manager);
	}

	public static isTickManager(manager: EntityManager<LivingEntity_>): manager is EntityManager<LivingEntity_> & ITickableBoss<LivingEntity_> {
		return "onBossTick" in manager;
	}

	public static isCustomBossbarManager(manager: EntityManager<LivingEntity_>): manager is EntityManager<LivingEntity_> & ICustomBossbar<LivingEntity_> {
		return "onBossbarUpdate" in manager;
	}

	public static isBoss(entity: unknown): boolean {
		return this.managers.some(manager => manager.isEntity(entity));
	}

	public static isCachedBoss(entity: unknown): boolean {
		return this.managers.some(manager => manager.isCachedEntity(entity));
	}

	public static hasCustomBossbar(entity: Entity_): boolean {
		const manager = EntityManagers.getManager(entity);
		return manager !== undefined && this.isCustomBossbarManager(manager);
	}

	public static tryCacheEntity(boss: LivingEntity_): boolean {
		for (const manager of this.managers) {
			if (manager.tryCacheEntity(boss)) return true;
		}
		return false;
	}

	public static eventHook(boss: Entity_, event: any): void {
		const manager = EntityManagers.getManager(boss);
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
			if (!EntityManager.isGenericBoss(entity) || (TheHunger.isCachedEntity(entity) && !TheHunger.isBossbarHolder(entity))) {
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

			manager.verifyEntityCache();
			if (manager.getBossCount(server) === 0) continue;

			const bosses = manager.getBosses(server);
			manager.onTickAll(server, bosses);

			const isTickable = this.isTickManager(manager);
			const hasCustomBossbar = this.isCustomBossbarManager(manager);
			if (!isTickable && !hasCustomBossbar) continue;

			for (const boss of bosses) {
				if (isTickable && boss.isAlive()) manager.onBossTick(boss);
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