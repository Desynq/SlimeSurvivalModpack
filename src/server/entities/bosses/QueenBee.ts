
const QueenBee = new (class extends BossManager<Bee_> implements TickableBoss<Bee_> {
	public override isBoss(entity: unknown): entity is Bee_ {
		return entity instanceof $Bee && entity.tags.contains("boss.queen_bee");
	}

	public bossExists(server: MinecraftServer_): boolean {
		return server.entities.toArray().some((e: Entity_) => this.isBoss(e));
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

	public getParticipants(boss: Bee_): ServerPlayer_[] {
		return boss.level.getNearbyPlayers(
			$TargetingConditions.forNonCombat().selector((player: ServerPlayer_) => PlayerHelper.isSurvivalLike(player)),
			boss as any,
			boss.boundingBox.inflate(32) as any
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
		if (TickHelper.tryUpdateTimestamp(boss as any, "queen_bee_minion_spawn_cooldown", spawnInterval)) {
			minions.push(...this.spawnMinions(boss, minions));
		}

		bees.forEach(bee => this.tickBeeDuringEvent(bee));
	}

	public onPlayerDeath(boss: Bee_, deadPlayer: ServerPlayer_): void {
		if (!boss.isDeadOrDying() && PlayerHelper.isSurvivalLike(deadPlayer)) {
			boss.health = Math.min(boss.maxHealth, boss.health + deadPlayer.maxHealth);
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



	private readonly MINION_CLASS = $Bee;
	private readonly QUEEN_BEE_CLASS = $Bee;
	private readonly MINION_DISTANCE = 32;

	private getMinionSpawnCooldownInterval(boss: Bee_): integer {
		const healthPercentage = boss.health / boss.maxHealth;
		const factor = Math.pow(healthPercentage, 1.5);
		const participantCount = this.getParticipantCount(boss);
		const max = 1200;
		const min = Math.max(300, Math.floor(max / (participantCount + 1)));

		const interval = MathHelper.lerp(min, max, factor);
		return interval;
	}

	private tryRegenerate(boss: Bee_): void {
		if (!boss.isDeadOrDying() && !this.hasParticipants(boss)) {
			const healAmount = 1 / TickHelper.getDefaultTickRate(boss.server);
			boss.health = Math.min(boss.maxHealth, boss.health + healAmount);
		}
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
	}

	private isQueenWithinDistance(minion: Bee_): boolean {
		const queensWithinRange = minion.level.getNearbyEntities(
			this.QUEEN_BEE_CLASS as any,
			$TargetingConditions.forNonCombat().selector(e => this.isBoss(e)),
			minion as any,
			minion.boundingBox.inflate(this.MINION_DISTANCE) as any
		);
		return queensWithinRange.size() > 0;
	}

	private spawnMinions(boss: Bee_, currentMinions: Bee_[]): Bee_[] {
		const maxMinions = 16;
		const toSpawn = Math.max(0, maxMinions - currentMinions.length);
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
	if (QueenBee.bossExists(event.entity.server)) {
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
	const queenBee = event.entity;

	if (QueenBee.isBoss(queenBee) && QueenBee.isBossImmune(queenBee)) {
		event.setCanceled(true);
	}
});