
class QueenBeeRewarder<T extends Bee_> extends BossRewarder<T> {

	protected override rewardPlayer(boss: T, player: ServerPlayer_): void {
		super.rewardPlayer(boss, player);
		LootTableHelper.giveLoot(player, "slimesurvival:items/loot_bag/queen_bee");
	}
}

// @ts-ignore
const QueenBee = new (class <T extends Bee_> extends RewardableEntityManager<T> implements ITickableBoss<T> {

	private readonly DEFAULT_MAX_HEALTH = 5000;
	private readonly REGEN_AMOUNT = 150;

	private readonly minionSpawnCooldown = new EntityTimestamp("queen_bee_minion_spawn_cooldown");
	private readonly chargeCooldown = new EntityTimestamp("queen_bee.charge_cooldown");

	private readonly MINION_CLASS = $Bee;
	private readonly QUEEN_BEE_CLASS = $Bee;
	private readonly MINION_DISTANCE = 32;
	private readonly lastHadMinions: Record<string, boolean> = {};
	private readonly POISON_CLOUD_TIMESTAMP_ID = "queen_bee.poison_cloud_cooldown";
	private readonly POISON_CLOUD_CHANCE = 0.25;
	private readonly ENRAGED_TAG_KEY = "queen_bee.enraged";

	protected override isEntity(entity: unknown): entity is T {
		return entity instanceof $Bee && entity.tags.contains("boss.queen_bee");
	}


	public isMinion(entity: unknown): entity is Bee_ {
		return entity instanceof this.MINION_CLASS && entity.tags.contains("queen_bee_minion");
	}

	public areMinionsAlive(boss: T): boolean {
		const minions = boss.level.getNearbyEntities(
			this.MINION_CLASS as any,
			$TargetingConditions.forNonCombat().selector(e => this.isMinion(e)),
			boss as any,
			boss.boundingBox.inflate(this.MINION_DISTANCE) as any
		);
		return minions.size() > 0;
	}

	public isBossImmune(boss: T): boolean {
		return this.areMinionsAlive(boss);
	}

	public hasParticipants(boss: T): boolean {
		return this.getParticipantCount(boss) > 0;
	}

	public getParticipantCount(boss: T): integer {
		return this.getParticipants(boss).length;
	}

	private readonly FORCEFIELD_RADIUS = 32;

	public getParticipants(boss: T): ServerPlayer_[] {
		return boss.level.getNearbyPlayers(
			$TargetingConditions.forNonCombat().selector((player: ServerPlayer_) => PlayerHelper.isSurvivalLike(player)),
			boss as any,
			boss.boundingBox.inflate(this.FORCEFIELD_RADIUS) as any
		).toArray();
	}



	public onBossTick(boss: T): void {
		if (boss.level.isNight()) {
			boss.discard();
			return;
		}

		const bees = this.getAllBees(boss, 32);
		const minions = bees.filter(bee => this.isMinion(bee)) as Bee_[];

		this.scaleHealth(boss);
		this.tryPassiveRegen(boss);

		const spawnInterval = this.getMinionSpawnCooldownInterval(boss);
		for (const player of this.getParticipants(boss)) {
			const ticksRemaining = this.minionSpawnCooldown.getRemaining(boss, spawnInterval);
			if (ticksRemaining === undefined) continue;

			ActionbarManager.addText(player, `{"color":"yellow","text":"Spawning in: ${ticksRemaining.toFixed(0)}"}`);
		}

		if (minions.length >= this.getMaxMinions(boss)) {
			TickHelper.forceUpdateTimestamp(boss as any, "queen_bee_minion_spawn_cooldown");
		}
		else if (!this.hasParticipants(boss)) {
			TickHelper.forceUpdateTimestamp(boss as any, "queen_bee_minion_spawn_cooldown");
			minions.push(...this.spawnMinionsAndHeal(boss, minions));
		}
		else if (TickHelper.tryUpdateTimestamp(boss as any, "queen_bee_minion_spawn_cooldown", spawnInterval)) {
			minions.push(...this.spawnMinionsAndHeal(boss, minions));
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

		if (this.isEnraged(boss)) {
			this.rageTick(boss);
		}


		bees.forEach(bee => this.tickBeeDuringEvent(bee));

		if (boss.isLeashed()) boss.dropLeash(true, false);

		ParticleHelper.spawnCircle(boss.level as any, boss.x, boss.y + 4, boss.z, 32, 256, "falling_nectar", 1, false);
	}

	public override onGlobalPlayerDeath(player: ServerPlayer_, event: LivingEntityDeathKubeEvent_): void {
		for (const boss of this.getEntities(player.server)) {
			this.onPlayerDeath(boss, player);
		}
	}

	private onPlayerDeath(boss: T, deadPlayer: ServerPlayer_): void {
		if (boss.isDeadOrDying()) return;

		const deathPos = deadPlayer.position();
		const bossPos = boss.position();

		const distSqr = bossPos.distanceToSqr(deathPos.x(), deathPos.y(), deathPos.z());

		if (distSqr <= 32 ** 2) {
			this.spawnMinionsAndHeal(boss, this.getMinions(boss));
		}
	}

	public onMinionTick(minion: T) {
		if (!this.isQueenWithinDistance(minion)) {
			minion.discard();
			return;
		}

		if (this.isQueenWithinDistance(minion)) {
			minion.setGlowing(true);
		}
		else {
			minion.setGlowing(false);
		}
	}

	private getMinions(boss: T): Bee_[] {
		const bees = this.getAllBees(boss, 32);
		const minions = bees.filter(bee => this.isMinion(bee)) as Bee_[];
		return minions;
	}

	private onAllMinionsKilled(boss: T): void {
		playsound(boss.level, boss.position(), "entity.ender_dragon.growl", "master", 4, 2);
		this.setEnraged(boss, true);
		this.chargeCooldown.update(boss);
	}

	private onMinionsReturned(boss: T): void {
		playsound(boss.level, boss.position(), "entity.ghast.death", "master", 4, 2);
		this.setEnraged(boss, false);
	}

	private isEnraged(boss: T): boolean {
		return boss.persistentData.getBoolean(this.ENRAGED_TAG_KEY);
	}

	private setEnraged(boss: T, value: boolean): void {
		boss.persistentData.putBoolean(this.ENRAGED_TAG_KEY, value);
	}

	private rageTick(boss: T): void {
		const target = boss.target as LivingEntity_ | null;
		if (!target) {
			return; // makes boss queue their charge for when the player comes back
		}

		const duration = this.getChargeCooldownDuration(boss);
		if (!this.chargeCooldown.tryUpdate(boss, duration)) return;

		PlaysoundHelper.playsound(boss.level, boss.position(), "entity.wither.ambient", "voice", 2, 2);
		this.flingAtTarget(boss, target);
	}

	private flingAtTarget(boss: T, target: LivingEntity_): void {
		const bossPos = boss.position();
		const targetPos = target.position();

		const dir = targetPos.subtract(bossPos as any).normalize();

		const strength = 1.5;
		const motion = dir.scale(strength);

		boss.setDeltaMovement(motion as any);

		boss.addDeltaMovement([0, 0.3, 0]);

		boss.getLookControl()["setLookAt(net.minecraft.world.entity.Entity,float,float)"](target, 30, 30);
	}

	private getChargeCooldownDuration(boss: T): integer {
		const min = 20;
		const max = 100;
		const healthPercent = boss.health / boss.maxHealth;
		const duration = MathHelper.lerp(min, max, healthPercent);
		return duration;
	}

	private tryPoisonCloud(boss: T): void {
		const interval = this.getPoisonCloudCooldownInterval(boss);
		const cooldownActive = !TickHelper.hasTimestampElapsed(boss as any, this.POISON_CLOUD_TIMESTAMP_ID, interval);
		if (cooldownActive) return;
		if (Math.random() >= this.POISON_CLOUD_CHANCE) return;

	}

	private getPoisonCloudCooldownInterval(boss: T): integer {
		return 200;
	}

	private getMaxMinions(boss: T): integer {
		const playerCount = Math.max(1, this.rewarder.getContributorCount(boss) - 1);
		return 16 + Math.floor(16 * Math.log2(playerCount));
	}

	private getMinionSpawnCooldownInterval(boss: T): integer {
		const healthPercentage = boss.health / boss.maxHealth;
		const factor = Math.pow(healthPercentage, 1.5);
		const participantCount = this.getParticipantCount(boss);
		const max = 1200;
		const min = 600;

		const interval = MathHelper.lerp(min, max, factor);
		return interval;
	}

	private scaleHealth(boss: T): void {
		const count = this.rewarder.getContributorCount(boss);

		const newMaxHealth = this.DEFAULT_MAX_HEALTH * Math.max(1, count);
		LivingEntityHelper.scaleHealth(boss, newMaxHealth);
	}

	private tryPassiveRegen(boss: T): void {
		if (this.hasParticipants(boss)) return;

		const tickRate = TickHelper.getDefaultTickRate(boss.server);
		let healAmount = (1 / 600) * boss.maxHealth / tickRate;
		LivingEntityHelper.heal(boss, healAmount);
	}

	private updateMaxHealth(boss: T): void {

	}

	private getAllBees(boss: T, distance: number): Bee_[] {

		return boss.level.getEntitiesOfClass($Bee as any, boss.boundingBox.inflate(distance) as any, (entity) => true).toArray();
	}

	private tickBeeDuringEvent(bee: Bee_) {
		const cond = $TargetingConditions.forCombat().selector((e: LivingEntity_) => !(e instanceof $Bee));
		const target = bee.level.getNearestEntity(
			$ServerPlayer as any,
			cond,
			bee as any,
			bee.x,
			bee.y,
			bee.z,
			bee.boundingBox.inflate(24) as any
		) as ServerPlayer_ | null;
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

	private spawnMinionsAndHeal(boss: T, currentMinions: Bee_[]): Bee_[] {
		this.healFromCurrentMinions(boss, currentMinions.length);
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

	private healFromCurrentMinions(boss: T, minionCount: integer): void {
		if (this.getParticipantCount(boss) === 0) return;

		const minionRatio = 1 / this.getMaxMinions(boss);
		const healPercent = minionCount * minionRatio;
		LivingEntityHelper.healPercent(boss, healPercent);
	}

})(new QueenBeeRewarder(1)).register();



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