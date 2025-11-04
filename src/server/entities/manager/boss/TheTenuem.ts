

const TheTenuem = new (class <T extends Phantom_ & Mob_> extends RewardableEntityManager<T> implements ITickableBoss<T>, ICustomBossbar<T> {

	public override isEntity(entity: unknown): entity is T {
		return entity instanceof $Phantom && entity.tags.contains("boss.tenuem");
	}

	public override onIncomingDamage(boss: T, event: LivingIncomingDamageEvent_): void {
		if (["lightningBolt", "inFire", "onFire"].includes(event.source.getType())) {
			event.setCanceled(true);
		}
	}

	public override onTickAll(server: MinecraftServer_, bosses: T[]): void {
		server.runCommandSilent(`weather thunder 1d`);
	}

	public override onGlobalPlayerDeath(player: ServerPlayer_, event: LivingEntityDeathKubeEvent_): void {
		const bosses = this.getEntities(player.server);
		for (const boss of bosses) {
			const healAmount = boss.maxHealth * 0.2;
			for (const p of ServerHelper.getPlayers(player.server)) {
				ActionbarManager.addMessage(p, `Boss healed: ${healAmount}`, 100, 100);
			}
			const newHealth = MathHelper.clamped(boss.health + healAmount, 0, boss.maxHealth);
			boss.health = newHealth;
		}
	}

	public onBossbarUpdate(boss: T): void {
		const server = boss.server;
		const bossbarManager = server.customBossEvents;

		const bossbarId = `boss:${boss.uuid.toString()}`;

		if (bossbarManager.get(bossbarId) == null) {
			server.runCommandSilent(`bossbar add ${bossbarId} ""`);
		}

		const count = this.getEntities(boss.server).length;

		server.runCommandSilent(`bossbar set ${bossbarId} max ${count}`);
		server.runCommandSilent(`bossbar set ${bossbarId} value ${count}`);

		server.runCommandSilent(`bossbar set ${bossbarId} color aqua`);
		const toughness = boss.getAttributeValue($Attributes.ARMOR_TOUGHNESS);
		server.runCommandSilent(
			`bossbar set ${bossbarId} name [{"selector":"${boss.username}"},{"color":"dark_aqua","text":": ${boss.health.toFixed(1)}/${boss.maxHealth.toFixed(1)} Shield: ${toughness.toFixed(1)}"}]`
		);

		server.runCommandSilent(`execute at ${boss.username} run bossbar set ${bossbarId} players @a[distance=0..]`);
	}

	public onBossTick(boss: T): void {
		if (boss.server.tickCount % 20 === 0) {
			this.scaleHealth(boss);
			this.trySmitePlayers(boss);
		}

		const minionCount = TenuemMinion.getEntityCount(boss.server);
		boss.setAttributeBaseValue($Attributes.ARMOR_TOUGHNESS, minionCount * 0.5);

		if (boss.server.tickCount % 5 === 0) {
			this.updateTarget(boss);
		}

		this.tryUnstuck(boss);
	}

	private readonly BOSS_EVENT_RANGE = 128;

	private getMaxMinions(boss: T): integer {
		return 32 * MathHelper.clamped(this.getPlayers(boss).length, 1, 3);
	}

	private readonly lastScaleHealthPlayerCount: Record<string, number | undefined> = {};
	private scaleHealth(boss: T): void {
		const players = this.getPlayers(boss);
		const playerCount = players.length;
		if (playerCount === this.lastScaleHealthPlayerCount[boss.stringUUID]) return;
		this.lastScaleHealthPlayerCount[boss.stringUUID] = playerCount;

		const newMaxHealth = Math.max(1, playerCount) * 10_000;
		LivingEntityHelper.scaleHealth(boss as any, newMaxHealth);
	}

	private tryUnstuck(boss: T): void {
		const surface = boss.level.getHeightmapPos("motion_blocking_no_leaves", [boss.x, boss.y, boss.z]);
		if (boss.y > surface.y + 64) {
			boss.teleportTo(boss.x, surface.y + 32, boss.z);
		}
	}

	private trySmitePlayers(boss: T): void {
		const players = this.getPlayers(boss);
		const chance = 1 / (1 + this.getEntityCount(boss.server));
		for (const player of players) {
			if (Math.random() >= chance) continue;
			this.smitePlayer(boss, player);
		}
	}

	private smitePlayer(boss: T, player: ServerPlayer_): void {
		const { x, z } = this.getRandomXZNear(player);
		const strikeZone = boss.level.getHeightmapPos("motion_blocking_no_leaves", [x, boss.y, z]);
		boss.server.runCommandSilent(`summon lightning_bolt ${strikeZone.x} ${strikeZone.y} ${strikeZone.z}`);

		this.spawnMinion(boss, new $Vec3(strikeZone.x, strikeZone.y + 4, strikeZone.z));
	}

	private getRandomXZNear(player: ServerPlayer_, radius = 16): { x: number, z: number; } {
		const angle = Math.random() * Math.PI * 2;
		const distance = Math.random() * radius;
		const x = Math.floor(player.x + Math.cos(angle) * distance);
		const z = Math.floor(player.z + Math.sin(angle) * distance);
		return { x, z };
	}

	private getPlayers(boss: T): ServerPlayer_[] {
		const players = ServerHelper.getSurvivors(boss.server)
			.filter(survivor => survivor.distanceToEntity(boss as any) < this.BOSS_EVENT_RANGE);
		return players;
	}

	private spawnMinion(boss: T, pos: Vec3_): boolean {
		const toSpawn = Math.max(0, this.getMaxMinions(boss) - TenuemMinion.getEntityCount(boss.server));
		if (toSpawn === 0) return false;

		Summonables.TENUEM_MINION.spawn(boss.level as any, pos);

		return true;
	}

	private updateTarget(boss: T): void {
		const survivors: { player: ServerPlayer_, distance: double; }[] = [];
		for (const survivor of ServerHelper.getSurvivors(boss.server)) {
			const distance = survivor.distanceToEntity(boss as any);
			if (distance >= this.BOSS_EVENT_RANGE) continue;
			survivors.push({ player: survivor, distance: distance });
		}
		if (survivors.length === 0) return;

		const nearest = ArrayHelper.getHighest(
			survivors,
			x => (x.player.health + x.player.armorValue) / (1 + x.distance / 32)
		).player;

		if (!nearest) return;
		boss.setTarget(nearest);
	}

})().register();