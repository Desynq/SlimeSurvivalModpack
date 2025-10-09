// priority: 2

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

	public onSpawn(boss: T, event: EntitySpawnedKubeEvent_): void { }

	public onDeath(boss: T, event: LivingEntityDeathKubeEvent_): void { }

	public onPlayerDeath(player: ServerPlayer_, event: LivingEntityDeathKubeEvent_): void { }

	public onIncomingDamage(boss: T, event: LivingIncomingDamageEvent_): void { }

	/**
	 * Runs regardless of whether the manager has any bosses
	 */
	public onServerTick(server: MinecraftServer_): void { }

	/**
	 * Only runs if `bosses.length > 0`
	 */
	public onTickAll(server: MinecraftServer_, bosses: T[]) { }

	/**
	 * Called after the entity cache has a boss added or removed.
	 */
	public onCountChange(server: MinecraftServer_) { }

	public onJoin(boss: T, event: EntityJoinLevelEvent_): void {
		this.tryCacheBoss(boss);
	}

	public onLeave(boss: T, event: EntityLeaveLevelEvent_): void {
		this.bossCache.remove(boss);
		BossManagerRegistry.unregister(boss);
		this.onCountChange(boss.server);
	}

	public onKill(boss: T, victim: LivingEntity_, event: LivingEntityDeathKubeEvent_): void { }

	private ensureBossCacheLoaded(server: MinecraftServer_): void {
		if (this.bossCache.count > 0) return;

		if (!BossDirector.tryGlobalCacheRebuild(server)) {
			for (const entity of server.getEntities()) {
				this.tryCacheBoss(entity);
			}
		}
	}

	public tryCacheBoss(entity: Entity_): boolean {
		if (!entity.isRemoved() && this.isBoss(entity)
			&& this.bossCache.add(entity)
		) {
			BossManagerRegistry.register(entity, this);
			this.onCountChange(entity.server);
			return true;
		}
		return false;
	}

	public verifyBossCache(): void {
		this.bossCache.verify(entity => this.isBoss(entity));
	}

	public getBosses(server: MinecraftServer_): T[] {
		this.ensureBossCacheLoaded(server);
		return this.bossCache.entities;
	}

	public getBossCount(server: MinecraftServer_): integer {
		this.ensureBossCacheLoaded(server);
		return this.bossCache.count;
	}

	public hasBoss(): boolean {
		return this.bossCache.count > 0;
	}
}