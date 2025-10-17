

const RiftMage = new (class <T extends Mob_ & LivingEntity_> extends EntityManager<T> implements ITickableBoss<T> {

	private readonly rewarder = new BossRewarder(1);
	private readonly sfManager = new SoulFlareManager();

	private readonly tsSoulFlare = new EntityTimestamp<T>("soul_flare");
	private readonly tsLastInteraction = new EntityTimestamp<T>("last_interaction");
	private readonly tsSwapPlayers = new EntityTimestamp<T>("swap_players");

	private readonly stepSizeFn = MathHelper.clampedSlopeIntercept(1.0, 0.5, 0.1, 2.0);

	public override isEntity(entity: unknown): entity is T {
		return entity instanceof $LivingEntity && entity.tags.contains("boss.rift_mage");
	}

	public override onLeave(entity: T, event: EntityLeaveLevelEvent_): void {
		super.onLeave(entity, event);
		this.sfManager.clear(entity);
	}

	public override onIncomingDamage(entity: T, event: LivingIncomingDamageEvent_): void {
		if (!event.source.is($TagKey.create($Registries.DAMAGE_TYPE, "minecraft:bypasses_invulnerability") as any) && !(event.source.actual instanceof $ServerPlayer)) {
			event.setCanceled(true);
		}
	}

	public override onAfterHurt(boss: T, event: AfterLivingEntityHurtKubeEvent_): void {
		if (!boss.isAlive()) return;

		playsound(boss.level, boss.eyePosition, "entity.enderman.teleport", "master", 1, 2);
		EntityHelper.teleportRandCircle(boss, boss.position(), 16);
		LivingEntityHelper.addEffect(boss, "cataclysm:stun", 20, 0, false, false, false);

		this.recordDamage(boss, event.damage, event.source.actual as Entity_ | undefined);

		TickHelper.forceUpdateTimestamp(boss, "last_hurt");
	}

	public override onPlayerDeath(player: ServerPlayer_, event: LivingEntityDeathKubeEvent_): void {
		for (const boss of this.getEntities(player.server)) {
			this.revertDamage(boss, player);
		}
	}

	public override onDeath(boss: T, event: LivingEntityDeathKubeEvent_): void {
		if (event.source.getType() !== "genericKill") {
			this.rewarder.rewardContributors(boss);
		}
		this.rewarder.resetContributors(boss);
	}

	public onBossTick(boss: T): void {
		this.scaleHealth(boss);

		if (boss.server.tickCount % 20 === 0) {
			this.updateTarget(boss);
			this.trySwapPlayers(boss);
		}

		this.tickSoulFlareAbility(boss);

		this.tryBoredomTeleport(boss);
		this.updateSoulFlares(boss);
	}

	private scaleHealth(boss: T): void {
		const playerCount = this.rewarder.getContributors(boss).length;
		BossHelper.scaleHealthByPlayers(boss, 500, playerCount);
	}

	private trySwapPlayers(boss: T): void {
		const players = this.rewarder.getContributors(boss).filter(player => player.distanceToEntity(boss) <= 64);
		if (players.length < 2) return;

		const ts = this.tsSwapPlayers;
		const duration = 40;

		if (boss.tickCount >= 300 && ts.hasElapsedPast(boss, duration, 200) && Math.random() < 0.5) {
			ts.update(boss);
			playsoundAll(boss.server, "minecraft:entity.evoker.prepare_summon", "master", 4, 2);
		}
		else if (ts.hasJustElapsed(boss, duration)) {
			this.swapPlayers(boss, players);
		}
	}

	private swapPlayers(boss: T, players: ServerPlayer_[]) {
		if (players.length < 2) return;
		ArrayHelper.shuffle(players);

		const firstPos = players[0].position();

		for (let i = 0; i < players.length - 1; i++) {
			const current = players[i];
			const next = players[i + 1];
			current.teleportTo(next.x, next.y, next.z);
			playsound(current.level, current.position(), "entity.enderman.teleport", "master", 1, 2);
		}

		const last = players[players.length - 1];
		last.teleportTo(firstPos.x(), firstPos.y(), firstPos.z());
		playsound(last.level, last.position(), "entity.enderman.teleport", "master", 1, 2);
	}

	public spawnShulkerBullets(boss: T): void {
		const target = boss.target;
		if (!(target instanceof $ServerPlayer)) return;

		const amount = MathHelper.randInt(2, 6);
		for (let i = 0; i < amount; i++) {
			this.spawnShulkerBullet(boss, target);
		}
	}

	private spawnShulkerBullet(boss: T, player: ServerPlayer_): void {
		const bullet = new $ShulkerBullet(boss.level as any, boss, player, "y") as Entity_ & ShulkerBullet_;

		bullet.setPos(boss.eyePosition as any);
		bullet.setOwner(boss);
		bullet.tags.add("rift_mage_bullet");

		boss.level.addFreshEntity(bullet);
	}

	private tickSoulFlareAbility(boss: T): void {
		const sds = BossHelper.getSurvivorDistances(boss, 32);
		if (sds.length === 0) {
			if (boss.glowing) boss.setGlowing(false);
			return;
		}

		const ts = this.tsSoulFlare;
		const elapsedTime = ts.getElapsedTime(boss, 20);

		if (boss.tickCount >= 100 && ts.hasElapsedPast(boss, 40, 100) && Math.random() < 0.1) {
			ts.update(boss);
			playsoundAll(boss.server, "entity.elder_guardian.curse", "master", 2, 0.5);
			boss.setGlowing(true);
		}
		else if (elapsedTime === 0) {
			this.spawnSoulFlares(boss, sds);
			boss.setGlowing(false);
		}
	}

	private spawnSoulFlares(boss: T, survivors: PlayerDistance[]): void {
		for (const sd of survivors) {
			this.spawnSoulFlare(boss, sd.player);
		}
	}

	private spawnSoulFlare(boss: T, player: ServerPlayer_): void {
		const ratio = boss.health / boss.maxHealth;
		const stepSize = this.stepSizeFn(ratio);

		const flare = SoulFlare.spawn(boss, player, 32, stepSize);
		this.sfManager.add(boss, flare);
	}

	private updateSoulFlares(boss: T): void {
		const flares = this.sfManager.getFlares(boss);
		if (flares.length === 0) return;
		const level = boss.level as any as ServerLevel_;

		ArrayHelper.forEachSplice(flares, flare => {
			const oldPos = flare.getPos();
			flare.tick(level);
			const newPos = flare.getPos();
			ParticleHelper.drawLine(level, oldPos[0], oldPos[1], oldPos[2], newPos[0], newPos[1], newPos[2],
				4 * flare.stepSize, "soul_fire_flame", 0.01, true
			);
			playsound(level, new $Vec3(newPos[0], newPos[1], newPos[2]), "entity.blaze.hurt", "master", 1, 0.5);

			flare.playerLineCollisionCheck(level, 0.25, 20).forEach(player => this.hurtPlayerHitBySoulFlare(boss, player));

			if (flare.hasElapsed(20)) {
				return "splice";
			}
		});
	}

	private hurtPlayerHitBySoulFlare(boss: T, player: ServerPlayer_): void {
		if (!PlayerHelper.isSurvivalLike(player) || !player.isAlive() || player.stats.timeSinceDeath < 100) return;
		EntropyHolder.getOrCreate(player).pushEntropyEntry(player.maxHealth * 2, boss);
	}

	private updateTarget(boss: T): void {
		const survivorDistances = BossHelper.getSurvivorDistances(boss, 128);
		if (survivorDistances.length === 0) return;

		const nearestPlayer = ArrayHelper.getLowest(
			survivorDistances,
			sd => sd.distance
		).player;

		boss.setTarget(nearestPlayer);
	}

	private tryBoredomTeleport(boss: T): void {
		if (this.tsLastInteraction.tryUpdate(boss, 200)) {
			const target = boss.target;
			if (!target) return;
			playsound(boss.level, boss.eyePosition, "entity.enderman.teleport", "master", 1, 0.5);
			EntityHelper.teleportRandDonut(boss, target.position(), 8, 16);
		}
	}

	public teleportAfterShootingBow(boss: T): void {
		playsound(boss.level, boss.eyePosition, "entity.enderman.teleport", "master", 1, 0.5);
		EntityHelper.teleportRandCircle(boss, boss.position(), 8);
		this.tsLastInteraction.update(boss); // stop it from potentially doing a boredom teleport right after, although it would be funny
	}

	private recordDamage(boss: T, amount: number, attacker?: Entity_) {
		const storage = boss.persistentData.getCompound("damage_taken");

		if (attacker instanceof $ServerPlayer) {
			this.rewarder.addContributor(boss, attacker);
			storage.putDouble(attacker.stringUUID, storage.getDouble(attacker.stringUUID) + amount);
		}
		else {
			storage.putDouble("unknown", storage.getDouble("unknown") + amount);
		}

		boss.persistentData.put("damage_taken", storage);
	}

	private revertDamage(boss: T, attacker?: Entity_) {
		const storage = boss.persistentData.getCompound("damage_taken");

		let totalDamage = 0;
		totalDamage += storage.getDouble("unknown");
		storage.remove("unknown");

		if (attacker instanceof $ServerPlayer) {
			totalDamage += storage.getDouble(attacker.stringUUID);
			storage.remove(attacker.stringUUID);
		}

		if (storage.size() === 0) {
			totalDamage = boss.maxHealth - boss.health;
		}

		boss.persistentData.put("damage_taken", storage);

		boss.health = Math.min(boss.maxHealth, boss.health + totalDamage);
	}
})().register();

EntityEvents.spawned(event => {
	const entity = event.entity;
	if (!(entity instanceof $Arrow)) return;

	const owner = entity.owner;
	if (RiftMage.isCachedEntity(owner)) {
		entity.setBaseDamage(10.0);
		RiftMage.teleportAfterShootingBow(owner as any);
	}
});

NativeEvents.onEvent($EntityTickEvent$Post, event => {
	const entity = event.entity;
	if (entity instanceof $ShulkerBullet && entity.isAlive() && entity.tags.contains("rift_mage_bullet") && entity.tickCount >= 100) {
		entity.discard();
	}
});

EntityEvents.afterHurt("minecraft:player" as any, event => {
	const player = event.entity as ServerPlayer_;
	const immediate = event.source.immediate;
	const attacker = event.source.actual;
	if (immediate instanceof $Arrow && RiftMage.isCachedEntity(attacker)) {
		LivingEntityHelper.addEffect(player, "cataclysm:stun", 20, 0, false, true, true, attacker);
		RiftMage.spawnShulkerBullets(attacker as any);
	}
});