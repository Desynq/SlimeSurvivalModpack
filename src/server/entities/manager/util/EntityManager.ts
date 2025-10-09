// priority: 2

abstract class EntityManager<T extends LivingEntity_> {
	private entityCache: EntityCache<T> = new EntityCache();

	public static isGenericBoss(entity: unknown): entity is LivingEntity_ {
		return entity instanceof $LivingEntity
			&& entity.tags.stream().anyMatch(tag => tag.startsWith("boss."));
	}

	/**
	 * Used for caching. Actual entity detection should use {@link isCachedEntity}
	 */
	public abstract isEntity(entity: unknown): entity is T;

	public isCachedEntity(entity: unknown): entity is T {
		return this.entityCache.isCached(entity);
	}

	public register(): this {
		EntityDirector.addManager(this);
		return this;
	}

	public onSpawn(entity: T, event: EntitySpawnedKubeEvent_): void { }

	public onDeath(entity: T, event: LivingEntityDeathKubeEvent_): void { }

	public onPlayerDeath(player: ServerPlayer_, event: LivingEntityDeathKubeEvent_): void { }

	public onIncomingDamage(entity: T, event: LivingIncomingDamageEvent_): void { }

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

	public onJoin(entity: T, event: EntityJoinLevelEvent_): void {
		this.tryCacheEntity(entity);
	}

	public onLeave(entity: T, event: EntityLeaveLevelEvent_): void {
		this.entityCache.remove(entity);
		EntityManagers.unregister(entity);
		this.onCountChange(entity.server);
	}

	public onKill(boss: T, victim: LivingEntity_, event: LivingEntityDeathKubeEvent_): void { }

	private ensureBossCacheLoaded(server: MinecraftServer_): void {
		if (this.entityCache.count > 0) return;

		if (!EntityDirector.tryGlobalCacheRebuild(server)) {
			for (const entity of server.getEntities()) {
				this.tryCacheEntity(entity);
			}
		}
	}

	public tryCacheEntity(entity: Entity_): boolean {
		if (!entity.isRemoved() && this.isEntity(entity)
			&& this.entityCache.add(entity)
		) {
			EntityManagers.register(entity, this);
			this.onCountChange(entity.server);
			return true;
		}
		return false;
	}

	public verifyBossCache(): void {
		this.entityCache.verify(entity => this.isEntity(entity));
	}

	public getBosses(server: MinecraftServer_): T[] {
		this.ensureBossCacheLoaded(server);
		return this.entityCache.entities;
	}

	public getBossCount(server: MinecraftServer_): integer {
		this.ensureBossCacheLoaded(server);
		return this.entityCache.count;
	}

	public hasBoss(): boolean {
		return this.entityCache.count > 0;
	}
}