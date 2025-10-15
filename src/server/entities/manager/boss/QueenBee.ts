
// @ts-ignore
const QueenBee = new (class extends EntityManager<Bee_> implements ITickableBoss<Bee_> {
	protected override isEntity(entity: unknown): entity is Bee_ {
		return entity instanceof $Bee && entity.tags.contains("boss.queen_bee");
	}

	public isMinion(entity: unknown): entity is Bee_ {
		return entity instanceof this.MINION_CLASS && entity.tags.contains("queen_bee_minion");
	}

	public areMinionsAlive(boss: Bee_): boolean {
		const minions = boss.level.getNearbyEntities(
			this.MINION_CLASS as any,
			$TargetingConditions.forNonCombat().selector(e => this.isMinion(e)),
			boss as any,
			boss.boundingBox.inflate(this.MINION_DISTANCE) as any
		);
		return minions.size() > 0;
	}

	public isBossImmune(boss: Bee_): boolean {
		return this.areMinionsAlive(boss);
	}

	public hasParticipants(boss: Bee_): boolean {
		return this.getParticipantCount(boss) > 0;
	}

	public getParticipantCount(boss: Bee_): integer {
		return this.getParticipants(boss).length;
	}

	private readonly FORCEFIELD_RADIUS = 32;

	public getParticipants(boss: Bee_): ServerPlayer_[] {
		return boss.level.getNearbyPlayers(
			$TargetingConditions.forNonCombat().selector((player: ServerPlayer_) => PlayerHelper.isSurvivalLike(player)),
			boss as any,
			boss.boundingBox.inflate(this.FORCEFIELD_RADIUS) as any
		).toArray();
	}



	public onBossTick(boss: Bee_): void {
		const bees = this.getAllBees(boss, 32);
		const minions = bees.filter(bee => this.isMinion(bee)) as Bee_[];

		this.tryRegenerate(boss);

		const spawnInterval = this.getMinionSpawnCooldownInterval(boss);
		this.getParticipants(boss).forEach(player => {
			const ticksRemaining = TickHelper.getTimestampRemaining(boss as any, "queen_bee_minion_spawn_cooldown", spawnInterval);
			ActionbarManager.addText(player, `{"color":"yellow","text":"Spawning in: ${ticksRemaining.toFixed(0)}"}`);
		});

		if (minions.length >= this.getMaxMinions(boss)) {
			TickHelper.forceUpdateTimestamp(boss as any, "queen_bee_minion_spawn_cooldown");
		}
		else if (!this.hasParticipants(boss)) {
			TickHelper.forceUpdateTimestamp(boss as any, "queen_bee_minion_spawn_cooldown");
			minions.push(...this.spawnMinions(boss, minions));
		}
		else if (TickHelper.tryUpdateTimestamp(boss as any, "queen_bee_minion_spawn_cooldown", spawnInterval)) {
			minions.push(...this.spawnMinions(boss, minions));
			playsound(boss.level, boss.position().add(0, 4, 0), "block.beehive.exit", "master", 4, 1);
		}

		const hadMinions = this.lastHadMinions[boss.stringUUID] ?? false;
		const hasMinions = minions.length > 0;
		if (hadMinions && !hasMinions) {
			this.onAllMinionsKilled(boss);
		}
		else if (!hadMinions && hasMinions) {
			this.onMinionsReturned(boss);
		}
		this.lastHadMinions[boss.stringUUID] = hasMinions;


		bees.forEach(bee => this.tickBeeDuringEvent(bee));

		if (boss.isLeashed()) boss.dropLeash(true, false);

		ParticleHelper.spawnCircle(boss.level as any, boss.x, boss.y + 4, boss.z, 32, 256, "falling_nectar", 1, false);
	}

	public onPlayerDeathOld(boss: Bee_, deadPlayer: ServerPlayer_): void {
		if (boss.isDeadOrDying()) return;

		const deathPos = deadPlayer.position();
		const bossPos = boss.position();

		const distSqr = bossPos.distanceToSqr(deathPos.x(), deathPos.y(), deathPos.z());

		if (distSqr <= 32 ** 2) {
			const regenAmount = 500;
			tellOperators(boss.server, `Healing boss for ${regenAmount}`);

			boss.health = Math.min(boss.maxHealth, boss.health + regenAmount);
		}
	}

	public onMinionTick(minion: Bee_) {
		if (!this.isQueenWithinDistance(minion)) {
			minion.remove("discarded");
			return;
		}

		if (this.isQueenWithinDistance(minion)) {
			minion.setGlowing(true);
		}
		else {
			minion.setGlowing(false);
		}
	}

	public onAllMinionsKilled(boss: Bee_): void {
		playsound(boss.level, boss.position(), "entity.ender_dragon.growl", "master", 4, 2);
	}

	public onMinionsReturned(boss: Bee_): void {
		playsound(boss.level, boss.position(), "entity.ghast.death", "master", 4, 2);
	}



	private readonly MINION_CLASS = $Bee;
	private readonly QUEEN_BEE_CLASS = $Bee;
	private readonly MINION_DISTANCE = 32;
	private readonly lastHadMinions: Record<string, boolean> = {};
	private readonly POISON_CLOUD_TIMESTAMP_ID = "queen_bee.poison_cloud_cooldown";
	private readonly POISON_CLOUD_CHANCE = 0.25;

	private tryPoisonCloud(boss: Bee_): void {
		const interval = this.getPoisonCloudCooldownInterval(boss);
		const cooldownActive = !TickHelper.hasTimestampElapsed(boss as any, this.POISON_CLOUD_TIMESTAMP_ID, interval);
		if (cooldownActive) return;
		if (Math.random() >= this.POISON_CLOUD_CHANCE) return;

	}

	private getPoisonCloudCooldownInterval(boss: Bee_): integer {
		return 200;
	}

	private getMaxMinions(boss: Bee_): integer {
		return 16 + ((ServerHelper.getSurvivorCount(boss.server) - 1) * 8);
	}

	private getMinionSpawnCooldownInterval(boss: Bee_): integer {
		const healthPercentage = boss.health / boss.maxHealth;
		const factor = Math.pow(healthPercentage, 1.5);
		const participantCount = this.getParticipantCount(boss);
		const max = 1200;
		const min = 600;

		const interval = MathHelper.lerp(min, max, factor);
		return interval;
	}

	private tryRegenerate(boss: Bee_): void {
		if (boss.isDeadOrDying() || this.hasParticipants(boss)) return;

		const survivorCount = ServerHelper.getSurvivorCount(boss.server);

		if (boss.health >= boss.maxHealth) {
			const newMaxHealth = 1000 * Math.max(1, survivorCount);
			if (newMaxHealth !== boss.maxHealth) {
				boss.maxHealth = newMaxHealth;
				boss.health = newMaxHealth;
			}
			return;
		}

		let healAmount = (1 / 600) * boss.maxHealth;
		const tickRate = TickHelper.getDefaultTickRate(boss.server);
		boss.health = Math.min(boss.maxHealth, boss.health + (healAmount / tickRate));
	}

	private updateMaxHealth(boss: Bee_): void {

	}

	private getAllBees(boss: Bee_, distance: number): Bee_[] {

		return boss.level.getEntitiesOfClass($Bee as any, boss.boundingBox.inflate(distance) as any, (entity) => true).toArray();
	}

	private tickBeeDuringEvent(bee: Bee_) {
		const cond = $TargetingConditions.forCombat().selector((e: LivingEntity_) => !(e instanceof $Bee));
		const target: LivingEntity_ | null = bee.level.getNearestEntity(
			$LivingEntity as any,
			cond,
			bee as any,
			bee.x,
			bee.y,
			bee.z,
			bee.boundingBox.inflate(24) as any
		);
		if (target) {
			bee.setTarget(target);
			bee.setAggressive(true);
		}
		bee.removeEffect($MobEffects.POISON);
	}

	private isQueenWithinDistance(minion: Bee_): boolean {
		const queensWithinRange = minion.level.getNearbyEntities(
			this.QUEEN_BEE_CLASS as any,
			$TargetingConditions.forNonCombat().selector(e => this.isCachedEntity(e)),
			minion as any,
			minion.boundingBox.inflate(this.MINION_DISTANCE) as any
		);
		return queensWithinRange.size() > 0;
	}

	private spawnMinions(boss: Bee_, currentMinions: Bee_[]): Bee_[] {
		const toSpawn = Math.max(0, this.getMaxMinions(boss) - currentMinions.length);
		const newMinions: Bee_[] = [];
		for (let i = 0; i < toSpawn; i++) {
			const minion = boss.level.createEntity($EntityType.BEE as any) as any as Bee_;
			minion.tags.add("queen_bee_minion");
			minion.setPos(boss.x, boss.y + 4, boss.z);
			boss.level.addFreshEntity(minion as any);
			newMinions.push(minion);
		}
		return newMinions;
	}
})().register();

NativeEvents.onEvent($BeeStingEvent, event => {
	if (QueenBee.hasEntity()) {
		event.setCanStingAgain(true);
	}
});

NativeEvents.onEvent($EntityTickEvent$Pre, event => {
	const entity = event.entity;
	if (QueenBee.isMinion(entity)) {
		QueenBee.onMinionTick(entity);
	}
});

NativeEvents.onEvent($LivingIncomingDamageEvent, event => {
	if (event.source.getType() === "genericKill") return;
	const queenBee = event.entity;

	if (QueenBee.isCachedEntity(queenBee) && QueenBee.isBossImmune(queenBee as any)) {
		event.setCanceled(true);
	}
});

EntityEvents.death("minecraft:player", event => {
	QueenBee.getEntities(event.server).forEach(boss => QueenBee.onPlayerDeathOld(boss, event.entity as ServerPlayer_));
});