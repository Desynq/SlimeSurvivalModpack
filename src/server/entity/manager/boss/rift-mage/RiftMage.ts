// priority: 2

const RiftMage = new (class <T extends Mob_ & LivingEntity_>
	extends EntityTraits.CannotMount(RewardableEntityManager<LivingEntity_>)
	implements ITickableBoss<T> {

	public readonly DEFAULT_MAX_HEALTH = 2500;

	private readonly sfManager = new SoulFlareManager();

	private readonly tsSoulFlare = new EntityTimestamp<T>("soul_flare");
	private readonly tsLastNonHurtTeleport = new EntityTimestamp<T>("last_interaction", 200);
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
		if (event.source.is($DamageTypeTags.BYPASSES_INVULNERABILITY as any)) return;
		if (event.source.actual instanceof $ServerPlayer) return;

		event.setCanceled(true);
	}

	public override onAfterHurt(boss: T, event: AfterLivingEntityHurtKubeEvent_): void {
		if (!boss.isAlive()) return;

		if (Math.random() < 0.75) {
			playsound(boss.level, boss.eyePosition, "entity.enderman.teleport", "master", 1, 2);
			EntityHelper.teleportRandCircle(boss, boss.position(), 16);
		}

		LivingEntityHelper.addEffect(boss, "cataclysm:stun", 20, 0, false, false, false);

		this.recordDamage(boss, event.damage, event.source.actual as Entity_ | undefined);

		TickHelper.forceUpdateTimestamp(boss, "last_hurt");
	}

	public override onGlobalPlayerDeath(player: ServerPlayer_, event: LivingEntityDeathKubeEvent_): void {
		for (const boss of this.getEntities(player.server)) {
			this.revertDamage(boss, player);
		}
	}

	public onBossTick(boss: T): void {
		this.scaleHealth(boss);

		if (boss.server.tickCount % 20 === 0) {
			this.updateTarget(boss);
			this.trySwapPlayers(boss);
		}

		this.tickSoulFlareAbility(boss);

		this.tryProxyTeleport(boss);
		this.tryBoredomTeleport(boss);

		this.updateSoulFlares(boss);
	}

	private scaleHealth(boss: T): void {
		const playerCount = this.rewarder.getContributorCount(boss);
		BossHelper.scaleHealthByPlayers(boss, this.DEFAULT_MAX_HEALTH, playerCount);
	}

	private trySwapPlayers(boss: T): void {
		const players = this.rewarder.getContributors(boss).filter(player => player.distanceToEntity(boss) <= 64);
		if (players.length < 2) return;

		const ts = this.tsSwapPlayers;
		const warnDuration = 20;
		const cooldown = 200;

		if (boss.tickCount >= cooldown && ts.hasElapsedPast(boss, warnDuration, cooldown) && Math.random() < 0.5) {
			ts.update(boss);
			playsoundAll(boss.server, "minecraft:entity.evoker.prepare_summon", "master", 4, 2);
		}
		else if (ts.hasJustElapsed(boss, warnDuration)) {
			this.swapPlayers(boss, players);
		}
	}

	private swapPlayers(boss: T, players: ServerPlayer_[]) {
		if (players.length < 2) return;
		ArrayHelper.shuffle(players);

		const firstPos = players[0].position();
		const firstYaw = players[0].yaw;
		const firstPitch = players[0].pitch;

		for (let i = 0; i < players.length - 1; i++) {
			const current = players[i];
			const next = players[i + 1];
			current.teleportTo(next.level as any, next.x, next.y, next.z, [], next.yRot, next.xRot);
			playsound(current.level, current.position(), "entity.enderman.teleport", "master", 1, 2);
		}

		const last = players[players.length - 1];
		last.teleportTo(last.level as any, firstPos.x(), firstPos.y(), firstPos.z(), [], firstYaw, firstPitch);
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
			PlaysoundHelper.playsoundLevel(boss.level, "entity.elder_guardian.curse", "voice", 2, 0.5);
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

		ArrayHelper.forEachDeferredSplice(flares, flare => {
			const oldPos = flare.getPos();
			flare.tick(level);
			const newPos = flare.getPos();
			ParticleHelper.drawLine(level, oldPos[0], oldPos[1], oldPos[2], newPos[0], newPos[1], newPos[2],
				8 * flare.stepSize, "soul_fire_flame", 0.01, true
			);
			playsound(level, new $Vec3(newPos[0], newPos[1], newPos[2]), "entity.blaze.hurt", "hostile", 1, 0.5);

			flare.playerLineCollisionCheck(level, 0.25, 20).forEach(player => this.hurtPlayerHitBySoulFlare(boss, player));

			if (flare.hasElapsed(20)) {
				return "splice";
			}
		});
	}

	private hurtPlayerHitBySoulFlare(boss: T, player: ServerPlayer_): void {
		if (!PlayerHelper.isSurvivalLike(player) || !player.isAlive() || player.stats.timeSinceDeath < 100) return;
		EntropyHelper.attackWithEntropy(player, boss, player.maxHealth * 3.0);
	}

	private updateTarget(boss: T): void {
		const survivorDistances = BossHelper.getSurvivorDistances(boss, 128);
		if (survivorDistances.length === 0) return;

		const nearestPlayer = ArrayHelper.getLowest(
			survivorDistances,
			sd => {
				const damagePercent = this.getDamage(boss, sd.player) / boss.maxHealth;
				return (sd.distance ** 1.5) / (damagePercent + 1e-6);
			}
		).player;

		boss.setTarget(nearestPlayer);
	}

	private tryBoredomTeleport(boss: T): void {
		if (this.tsLastNonHurtTeleport.tryUpdate(boss)) {
			const target = boss.target;
			if (!target) return;
			EntityHelper.teleportRandDonut(boss, target.position(), 8, 16);
			playsound(boss.level, boss.eyePosition, "entity.enderman.teleport", "master", 2, 0.5);
		}
	}

	private tryProxyTeleport(boss: T): void {
		const target = boss.target;
		if (!target || target.distanceToEntity(boss) < 64) return;

		EntityHelper.teleportRandDonut(boss, target.position(), 12, 32);
		playsound(boss.level, boss.eyePosition, "entity.enderman.scream", "master", 4, 1);
		this.tsLastNonHurtTeleport.update(boss);
	}

	public teleportAfterShootingBow(boss: T): void {
		playsound(boss.level, boss.eyePosition, "entity.enderman.teleport", "master", 1, 0.5);
		EntityHelper.teleportRandCircle(boss, boss.position(), 8);
		this.tsLastNonHurtTeleport.update(boss); // stop it from potentially doing a boredom teleport right after, although it would be funny
	}

	private recordDamage(boss: T, amount: number, attacker?: Entity_) {
		const storage = boss.persistentData.getCompound("damage_taken");

		if (attacker instanceof $ServerPlayer) {
			this.rewarder.addContributor(boss, attacker);
			storage.putDouble(attacker.stringUUID, storage.getDouble(attacker.stringUUID) + amount);
			CommandHelper.runCommandSilent(attacker.server, `scoreboard players add ${attacker.username} rift_mage_damage ${Math.floor(amount)}`);
		}

		boss.persistentData.put("damage_taken", storage);
	}

	private revertDamage(boss: T, player: ServerPlayer_) {
		const uuid = player.stringUUID;
		const takenDamageStorage = boss.persistentData.getCompound("damage_taken");
		if (!takenDamageStorage.contains(uuid)) return; // player has not dealt damage, do not revert damage

		const totalPlayerDamage = takenDamageStorage.getAllKeys()
			.stream()
			.mapToDouble(key => takenDamageStorage.getDouble(key))
			.sum();

		const playerDamage = takenDamageStorage.getDouble(uuid);
		takenDamageStorage.remove(uuid);
		boss.persistentData.put("damage_taken", takenDamageStorage);

		const keptDamageStorage = boss.persistentData.getCompound("kept_damage");
		const previousKeptDamage = keptDamageStorage.getDouble(uuid);
		const keptDamage = playerDamage * 0.05 + previousKeptDamage;
		keptDamageStorage.putDouble(uuid, keptDamage);
		const totalKeptDamage = keptDamageStorage.getAllKeys()
			.stream()
			.mapToDouble(key => keptDamageStorage.getDouble(key))
			.sum();
		boss.persistentData.put("kept_damage", keptDamageStorage);



		CommandHelper.runCommandSilent(player.server, `scoreboard players set ${player.username} rift_mage_damage ${Math.ceil(keptDamage)}`);

		const missingHealth = boss.maxHealth - boss.health;
		const otherPlayersDamage = totalPlayerDamage - playerDamage;
		const healAmount = missingHealth - otherPlayersDamage - totalKeptDamage;

		boss.health = MathHelper.clamped(boss.health + healAmount, 0, boss.maxHealth);
	}

	private getDamage(boss: T, player: ServerPlayer_): number {
		const storage = boss.persistentData.getCompound("damage_taken");
		return storage.getDouble(player.stringUUID);
	}
})().register();