


// @ts-ignore
const TheHunger = new (class <T extends Mob_> extends BossManager<T> implements TickableBoss<T>, CustomBossbar<T> {
	public readonly BOSS_ID = "minecraft:rabbit";
	public readonly MOB_SEARCH_RANGE = 128;
	public readonly MOB_AGGRO_RANGE = 16;
	public readonly PLAYER_AGGRO_RANGE = 128;
	public readonly SPAWN_CAP = 128;

	protected override isBoss(entity: unknown): entity is T {
		return entity instanceof $Mob && entity.tags.contains("boss.the_hunger") && EntityHelper.isType(entity as any, this.BOSS_ID);
	}

	public getMaxHealth(server: MinecraftServer_): float {
		const count = Math.max(1, this.getBossCount(server));
		const ratio = Math.min(1, Math.log(count) / Math.log(this.SPAWN_CAP));
		const maxHealth = 256;
		const minHealth = 1;

		const result = 1 + (maxHealth - minHealth) * (1 - ratio);
		return result;
	}

	public getScale(server: MinecraftServer_): double {
		const count = Math.max(1, this.getBossCount(server));
		const ratio = Math.min(1, Math.log(count) / Math.log(this.SPAWN_CAP));
		const maxScale = 4;
		const minScale = 1;

		const result = 1 + (maxScale - minScale) * (1 - ratio);
		return result;
	}

	public getJumpStrength(server: MinecraftServer_): double {
		const count = Math.max(1, this.getBossCount(server));
		const ratio = Math.min(1, Math.log(count) / Math.log(this.SPAWN_CAP / 4));
		const maxJumpStrength = 2.0;
		const minJumpStrength = 0.4;

		const result = maxJumpStrength - (maxJumpStrength - minJumpStrength) * ratio;
		return result;
	}

	public isBossbarHolder(boss: T): boolean {
		return this.getBosses(boss.server).indexOf(boss) === 0;
	}

	public onBossTick(boss: T): void {
		if (boss.tickCount % 10 === 0) {
			this.updateTarget(boss);
			if (!boss.aggressive) {
				boss.setAggressive(true);
			}
			boss.goalSelector.availableGoals
				.stream()
				.filter(goal => goal instanceof $AvoidEntityGoal || goal instanceof $PanicGoal)
				.forEach(goal => boss.goalSelector.removeGoal(goal.getGoal()));
		}
		TimeHelper.shiftTime(boss.server, 6000);

		LivingEntityHelper.removeHarmfulEffects(boss as any);
		this.updateHealth(boss);
		this.updateScale(boss);
		this.updateJumpStrength(boss);

		this.eatNearbyItems(boss);
	}

	public onBossbarUpdate(boss: T): void {
		if (!this.isBossbarHolder(boss)) return;

		const server = boss.server;
		const bossbarManager = server.customBossEvents;

		const bossbarId = `boss:${boss.uuid.toString()}`;

		if (bossbarManager.get(bossbarId) == null) {
			server.runCommandSilent(`bossbar add ${bossbarId} ""`);
		}

		const count = this.getBosses(boss.server).length;

		server.runCommandSilent(`bossbar set ${bossbarId} max ${count}`);
		server.runCommandSilent(`bossbar set ${bossbarId} value ${count}`);

		server.runCommandSilent(`bossbar set ${bossbarId} color red`);
		server.runCommandSilent(`bossbar set ${bossbarId} name [{"selector":"${boss.username}"},{"color":"dark_red","text":": ${count} Scurge Left"}]`);

		server.runCommandSilent(`execute at ${boss.username} run bossbar set ${bossbarId} players @a[distance=0..]`);
	}


	private eatNearbyItems(boss: T): void {
		const level = boss.level;
		const aabb = boss.boundingBox.inflate(0.5);

		const nearbyItems = level.getEntitiesOfClass($ItemEntity as any, aabb as any).toArray() as ItemEntity_[];

		nearbyItems.forEach(item => {
			playsound(level, item.position(), "entity.generic.eat", "master", 1, 0.5);
			item.kill();
		});
	}

	private readonly LIVING_ENTITY_CONDITION = $TargetingConditions.forCombat().selector((e: LivingEntity_) =>
		!this.isCachedBoss(e)
		&& e.onGround()
	);

	private decayHealth(boss: T): void {
		const decay = 0.01;
		boss.health = Math.max(0, boss.health - decay);
	}

	private updateHealth(boss: T): void {
		const oldMax = boss.maxHealth;
		const newMax = this.getMaxHealth(boss.server);
		if (oldMax === newMax) return;
		if (oldMax <= 0) return; // protecting against divide by 0

		const scale = newMax / oldMax;
		const oldHealth = boss.health;
		boss.maxHealth = newMax;
		boss.health = Math.min(newMax, oldHealth * scale);
	}

	private updateScale(boss: T): void {
		const currentScale = boss.getAttributeBaseValue($Attributes.SCALE);
		const newScale = this.getScale(boss.server);
		if (newScale === currentScale) return;
		boss.setAttributeBaseValue($Attributes.SCALE, newScale);
	}

	private updateJumpStrength(boss: T): void {
		const oldValue = boss.getAttributeBaseValue($Attributes.JUMP_STRENGTH);
		const newValue = this.getJumpStrength(boss.server);
		if (newValue === oldValue) return;
		boss.setAttributeBaseValue($Attributes.JUMP_STRENGTH, newValue);
	}

	private updateTarget(boss: T): void {
		const livingEntity: LivingEntity_ | null = boss.level.getNearestEntity(
			$LivingEntity as any,
			this.LIVING_ENTITY_CONDITION,
			boss as any,
			boss.x,
			boss.y,
			boss.z,
			boss.boundingBox.inflate(this.MOB_SEARCH_RANGE) as any
		);
		// prioritize nearby mobs to distress players; will still target players if they're the closest living entity
		if (livingEntity && boss.distanceToEntity(livingEntity) <= this.MOB_AGGRO_RANGE) {
			if (boss.target !== livingEntity) boss.setTarget(livingEntity);
			return;
		}

		// will cause bosses to slowly inch towards the closest player when nearby living mobs aren't available
		const player = boss.level.getNearestPlayer(boss.x, boss.y, boss.z, this.PLAYER_AGGRO_RANGE, p => PlayerHelper.isSurvivalLike(p as any)) as ServerPlayer_ | null;
		if (player) {
			if (boss.target !== player) boss.setTarget(player);
			return;
		}

		// fallback to allow roaming if it can't find a player to close in on
		if (livingEntity) {
			if (boss.target !== livingEntity) boss.setTarget(livingEntity);
		}
	}

	public duplicate(boss: T): boolean {
		const count = this.getBosses(boss.server).length;
		if (count >= this.SPAWN_CAP) return false;

		const entity = Summonables.THE_HUNGER.spawn(boss.level as any, boss.position());
		this.updateHealth(entity as any as T);
		return true;
	}
})().register();

EntityEvents.death(event => {
	const attacker = event.source.actual;
	if (TheHunger.isCachedBoss(attacker)) {
		TheHunger.duplicate(attacker);
	}
});