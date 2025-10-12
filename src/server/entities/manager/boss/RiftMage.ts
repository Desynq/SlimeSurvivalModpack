

// @ts-ignore
const RiftMage = new (class <T extends Mob_> extends EntityManager<T> implements ITickableBoss<T> {

	public override isEntity(entity: unknown): entity is T {
		return entity instanceof $LivingEntity && entity.tags.contains("boss.rift_mage");
	}

	public override onIncomingDamage(entity: T, event: LivingIncomingDamageEvent_): void {
		if (!event.source.is($TagKey.create($Registries.DAMAGE_TYPE, "minecraft:bypasses_invulnerability") as any) && !(event.source.actual instanceof $ServerPlayer)) {
			event.setCanceled(true);
		}
	}

	public override onAfterHurt(boss: T, event: AfterLivingEntityHurtKubeEvent_): void {
		if (!boss.isAlive()) return;

		EntityHelper.teleportRandDonut(boss as any, boss.position(), 16, 32);
		LivingEntityHelper.addEffect(boss as any, "cataclysm:stun", 20, 0, false, false, false);

		this.tallyDamage(boss, event.damage, event.source.actual as Entity_ | undefined);

		TickHelper.forceUpdateTimestamp(boss as any, "last_hurt");
	}

	public override onPlayerDeath(player: ServerPlayer_, event: LivingEntityDeathKubeEvent_): void {
		for (const boss of this.getBosses(player.server)) {
			this.revertDamage(boss, player);
		}
	}

	public onBossTick(boss: T): void {
		if (boss.server.tickCount % 20 === 0) {
			this.updateTarget(boss);
		}

		this.trySwitchWeapon(boss);
		this.tryBoredomTeleport(boss);
	}

	private updateTarget(boss: T): void {
		const survivorDistances = BossHelper.getSurvivorDistances(boss as any, 128);
		if (survivorDistances.length === 0) return;

		const nearestPlayer = ArrayHelper.getLowest(
			survivorDistances,
			sd => sd.distance
		).player;

		boss.setTarget(nearestPlayer);
	}

	private tryBoredomTeleport(boss: T): void {
		if (TickHelper.tryUpdateTimestamp(boss as any, "last_hurt", 200)) {
			const target = boss.target;
			if (!target) return;
			EntityHelper.teleportRandDonut(boss as any, target.position(), 8, 16);
		}
	}

	private trySwitchWeapon(boss: T): void {
		const target = boss.target;
		if (!target) return;

		const targetReach = target.getAttributeValue($Attributes.ENTITY_INTERACTION_RANGE);
		const targetWithinMelee = target.distanceToEntity(boss as any) <= Math.max(4, targetReach * 2);

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

	private tallyDamage(boss: T, amount: number, attacker?: Entity_) {
		const storage = boss.persistentData.getCompound("damage_taken");

		if (attacker instanceof $ServerPlayer) {
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