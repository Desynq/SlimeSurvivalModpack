// priority: 100

abstract class EntityManager<T extends LivingEntity_> {
	private entityCache: EntityCache<T> = new EntityCache();

	/**
	 * TODO: Move this to a static helper
	 */
	public static isGenericBoss(entity: unknown): entity is LivingEntity_ {
		return entity instanceof $LivingEntity
			&& entity.tags.stream().anyMatch(tag => tag.startsWith("boss."));
	}

	/**
	 * Used for caching. Actual entity detection should use {@link isCachedEntity}
	 */
	public abstract isEntity(entity: unknown): entity is T;

	public isCachedEntity(entity: unknown): boolean {
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

	public onAfterHurt(entity: T, event: AfterLivingEntityHurtKubeEvent_): void { }

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

	public onAdd(entity: T) { }

	public onJoin(entity: T, event: EntityJoinLevelEvent_): void {
		this.tryCacheEntity(entity);
	}

	public onLeave(entity: T, event: EntityLeaveLevelEvent_): void {
		this.entityCache.remove(entity);
		EntityManagers.unregister(entity);
		this.onCountChange(entity.server);
	}

	public onKill(boss: T, victim: LivingEntity_, event: LivingEntityDeathKubeEvent_): void { }

	public onEntityMount(boss: T, event: EntityMountEvent_): void { }

	private ensureEntityCacheLoaded(server: MinecraftServer_): void {
		if (this.entityCache.count > 0) return;

		EntityDirector.tryGlobalCacheRebuild(server);
	}

	public tryCacheEntity(entity: LivingEntity_): boolean {
		if (!entity.isRemoved() && this.isEntity(entity)
			&& this.entityCache.add(entity)
		) {
			EntityManagers.register(entity, this);
			this.onAdd(entity);
			this.onCountChange(entity.server);
			return true;
		}
		return false;
	}

	public verifyEntityCache(): void {
		this.entityCache.verify(entity => this.isEntity(entity));
	}

	public getEntities(server: MinecraftServer_): T[] {
		this.ensureEntityCacheLoaded(server);
		return this.entityCache.entities;
	}

	public getEntityCount(server: MinecraftServer_): integer {
		this.ensureEntityCacheLoaded(server);
		return this.entityCache.count;
	}

	public hasEntity(): boolean {
		return this.entityCache.count > 0;
	}
}