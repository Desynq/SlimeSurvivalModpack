

const RiftMage = new (class <T extends Mob_ & LivingEntity_> extends EntityManager<T> implements ITickableBoss<T> {

	private readonly rewarder = new BossRewarder(1);

	private readonly soulFlares: Record<string, SoulFlare[]> = {};

	private readonly tsSoulFlare = new EntityTimestamp<T>("soul_flare");
	private readonly tsLastInteraction = new EntityTimestamp<T>("last_interaction");

	public override isEntity(entity: unknown): entity is T {
		return entity instanceof $LivingEntity && entity.tags.contains("boss.rift_mage");
	}

	public override onAdd(entity: T): void {
		this.soulFlares[entity.stringUUID] ??= [];
	}

	public override onLeave(entity: T, event: EntityLeaveLevelEvent_): void {
		super.onLeave(entity, event);
		delete this.soulFlares[entity.stringUUID];
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
		this.rewarder.rewardContributors(boss);
		this.rewarder.resetContributors(boss);
	}

	public onBossTick(boss: T): void {
		if (boss.server.tickCount % 20 === 0) {
			this.updateTarget(boss);
		}

		this.tickSoulFlareAbility(boss);

		this.trySwitchWeapon(boss);
		this.tryBoredomTeleport(boss);
		this.updateSoulFlares(boss);
	}

	private tickSoulFlareAbility(boss: T): void {
		const sds = BossHelper.getSurvivorDistances(boss, 32);
		if (sds.length === 0) return;

		const ts = this.tsSoulFlare;
		const elapsedTime = ts.getElapsedTime(boss, 20);

		if (boss.tickCount >= 100 && ts.hasElapsedPast(boss, 20, 100) && Math.random() < 0.5) {
			ts.update(boss);
			playsoundAll(boss.server, "entity.elder_guardian.curse", "master", 2, 0.5);
		}
		else if (elapsedTime === 0) {
			this.spawnSoulFlares(boss, sds);
		}
	}

	private spawnSoulFlares(boss: T, survivors: PlayerDistance[]): void {
		for (const sd of survivors) {
			this.spawnSoulFlare(boss, sd.player);
		}
	}

	private spawnSoulFlare(boss: T, player: ServerPlayer_): void {
		const flare = SoulFlare.spawn(boss, player, 32, 2.0);
		if (flare === undefined) return;
		this.soulFlares[boss.stringUUID].push(flare);
	}

	private updateSoulFlares(boss: T): void {
		const flares = this.soulFlares[boss.stringUUID];
		if (flares.length === 0) return;
		const level = boss.level as any as ServerLevel_;

		ArrayHelper.forEachRight(flares, flare => {
			const oldPos = flare.getPos();
			flare.tick(level);
			const newPos = flare.getPos();
			ParticleHelper.drawLine(level, oldPos[0], oldPos[1], oldPos[2], newPos[0], newPos[1], newPos[2],
				4 * flare.stepSize, "soul_fire_flame", 0, true
			);
			playsound(level, new $Vec3(newPos[0], newPos[1], newPos[2]), "entity.blaze.hurt", "master", 1, 0.5);

			flare.playerLineCollisionCheck(level, 0.25, 24).forEach(player => this.hurtPlayerHitBySoulFlare(boss, player));

			if (flare.hasElapsed(20)) {
				return "splice";
			}
		});
	}

	private hurtPlayerHitBySoulFlare(boss: T, player: ServerPlayer_): void {
		if (!PlayerHelper.isSurvivalLike(player) || !player.isAlive() || player.stats.timeSinceDeath < 100) return;
		EntropyHolder.getOrCreate(player).pushEntropyEntry(player.maxHealth * 4, boss);
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

	private trySwitchWeapon(boss: T): void {
		const target = boss.target;
		if (!target) return;

		const targetReach = target.getAttributeValue($Attributes.ENTITY_INTERACTION_RANGE);
		const targetWithinMelee = target.distanceToEntity(boss) <= Math.max(4, targetReach * 2);

		if (targetWithinMelee) {
			if (boss.getMainHandItem().id !== "minecraft:netherite_axe" as any) {
				boss.setMainHandItem(new $ItemStack("minecraft:netherite_axe" as any) as any);
			}
		}
		else {
			if (boss.getMainHandItem().id !== "minecraft:bow" as any) {
				boss.setMainHandItem(new $ItemStack("minecraft:bow" as any) as any);
			}
		}
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
		attacker?.tell("reverted boss damage, bozo");
		const storage = boss.persistentData.getCompound("damage_taken");

		let totalDamage = 0;
		totalDamage += storage.getDouble("unknown");
		storage.remove("unknown");

		if (attacker instanceof $ServerPlayer) {
			totalDamage += storage.getDouble(attacker.stringUUID);
			storage.remove(attacker.stringUUID);
		}

		boss.health = Math.min(boss.maxHealth, boss.health + totalDamage);
	}
})().register();

EntityEvents.spawned(event => {
	const entity = event.entity;
	if (!(entity instanceof $Arrow)) return;

	const owner = entity.owner;
	if (RiftMage.isCachedEntity(owner)) {
		RiftMage.teleportAfterShootingBow(owner as any);
	}
});