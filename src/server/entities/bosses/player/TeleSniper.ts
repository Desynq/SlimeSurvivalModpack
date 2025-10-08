

// @ts-ignore
const PatrolHelicopter = new (class <T extends ServerPlayer_> extends BossManager<T> implements ITickableBoss<T>, ICustomBossbar<T> {
	public readonly BOSS_ID = "minecraft:player";

	protected override isBoss(entity: unknown): entity is T {
		return entity instanceof $ServerPlayer && entity.tags.contains("boss.telesniper");
	}

	public override onIncomingDamage(boss: T, event: LivingIncomingDamageEvent_): void {
		if (event.source.getType() === "thorns") {
			event.setCanceled(true);
			return;
		}
	}

	public onBossTick(boss: T): void {
		boss.setInvisible(true);

		const survivors = ServerHelper.getSurvivors(boss.server);
		for (const survivor of survivors) {
			if (survivor === boss) continue;
			if (survivor.distanceToEntity(boss) > 128) continue;
			LivingEntityHelper.addEffect(survivor, "glowing", 20, 0, false, false, false, boss);
		}
	}

	public override onKill(boss: T, victim: LivingEntity_, event: LivingEntityDeathKubeEvent_): void {
		if (victim instanceof $ServerPlayer) {
			boss.health = Math.min(boss.maxHealth, boss.health + victim.maxHealth);
		}
	}

	public onBossbarUpdate(boss: T): void {
		const server = boss.server;
		const bossbarManager = server.customBossEvents;
		const healthString = boss.health.toFixed(2);
		const maxHealthString = boss.maxHealth.toFixed(2);

		const bossbarId = `boss:${boss.stringUUID}`;

		if (bossbarManager.get(bossbarId) == null) {
			server.runCommandSilent(`bossbar add ${bossbarId} ""`);
		}

		server.runCommandSilent(`bossbar set ${bossbarId} max ${boss.maxHealth}`);
		server.runCommandSilent(`bossbar set ${bossbarId} value ${boss.health}`);

		server.runCommandSilent(`bossbar set ${bossbarId} color white`);
		server.runCommandSilent(`bossbar set ${bossbarId} style notched_10`);
		server.runCommandSilent(`bossbar set ${bossbarId} name [{"color":"gray","text":"Telesniper"},{"color":"dark_red","text":": ${healthString}/${maxHealthString}"}]`);

		server.runCommandSilent(`execute at ${boss.username} run bossbar set ${bossbarId} players @a[distance=0..]`);
	}
})().register();