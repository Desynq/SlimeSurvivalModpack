


// @ts-ignore
const Draugrnaut = new (class <T extends Mob_> extends EntityManager<T> implements ITickableBoss<T> {
	public readonly BOSS_ID = "rottencreatures:immortal";

	protected override isEntity(entity: unknown): entity is T {
		return entity instanceof $Mob && entity.tags.contains("boss.the_immortal") && EntityHelper.isType(entity as any, this.BOSS_ID);
	}

	public onBossTick(boss: T): void {
		this.heal(boss);
		this.tryHealthPercent(boss);
	}

	public override onIncomingDamage(boss: T, event: LivingIncomingDamageEvent_): void {
		if (event.source.getType() === "genericKill") return;
		const weapon = event.source.weaponItem;
		if (!weapon) {
			event.setCanceled(true);
			return;
		}

		const hasSmite = StackHelper.hasEnchantment(boss.server, weapon, "minecraft:smite");
		if (!hasSmite) {
			event.setCanceled(true);
			return;
		}
	}

	public override onLeave(boss: T, event: EntityLeaveLevelEvent_): void {
		super.onLeave(boss, event);
		if (boss.health <= 0) return;
		const survivors = ServerHelper.getSurvivors(boss.server);
		if (survivors.length === 0) return;

		const randomSurvivor = survivors[Math.floor(Math.random() * survivors.length)];

		const newBoss = Summonables.THE_IMMORTAL.spawn(boss.level as any, boss.position());
		EntityHelper.teleportRandCircle(newBoss, randomSurvivor.position(), 32);


		this.spawnZappies(boss, boss.position(), 4);

		boss.discard();
	}

	public override onPlayerDeath(player: ServerPlayer_, event: LivingEntityDeathKubeEvent_): void {
		this.getBosses(player.server).forEach(boss => {
			const distance = boss.distanceToEntitySqr(player);
			if (distance > 32) return;
			const amount = Math.ceil(player.maxHealth * 0.1);
			this.spawnZappies(boss, player.position(), amount);
		});
	}

	private tryHealthPercent(boss: T): void {
		if (!this.trySetLowestHealthPercent(boss)) return;
		const percent = this.getLowestHealthPercent(boss);
		const band = Math.floor(percent * 20);
		if (band > 0) {
			this.spawnZappies(boss, boss.position(), band * 4);
		}
	}

	private trySetLowestHealthPercent(boss: T): boolean {
		const percent = boss.health / boss.maxHealth;
		if (this.getLowestHealthPercent(boss) <= percent) return false;
		boss.persistentData.putFloat("boss.lowest_health_percent", percent);
		return true;
	}

	private getLowestHealthPercent(boss: T): float {
		if (!boss.persistentData.contains("boss.lowest_health_percent")) {
			return boss.maxHealth;
		}
		return boss.persistentData.getFloat("boss.lowest_health_percent");
	}

	private spawnZappies(boss: T, pos: Vec3_, amount: integer) {
		for (let i = 0; i < amount; i++) {
			const zappy = Summonables.ZAPPY.spawn(boss.level as any, pos, false);
			EntityHelper.teleportRandCircle(zappy, pos, 8);
		}
	}

	private heal(boss: T): void {
		if (boss.onFire) return;
		boss.health = Math.min(boss.maxHealth, boss.health + 1);
	}
})().register();