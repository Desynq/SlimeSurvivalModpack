

// @ts-ignore
const TheTenuem = new (class <T extends Phantom_> extends EntityManager<T> implements ITickableBoss<T> {

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

	public override onPlayerDeath(player: ServerPlayer_, event: LivingEntityDeathKubeEvent_): void {
		const bosses = this.getBosses(player.server);
		for (const boss of bosses) {
			const newHealth = Math.min(boss.maxHealth, boss.health + boss.maxHealth * 0.2);
			tellOperators(player.server, `Healed boss to ${newHealth}`);
			boss.health = newHealth;
		}
	}

	public onBossTick(boss: T): void {
		if (boss.server.tickCount % 20 === 0) {
			this.trySmitePlayers(boss);
		}

		const minionCount = TenuemMinion.getBossCount(boss.server);
		boss.setAttributeBaseValue($Attributes.ARMOR, minionCount);

		if (boss.server.tickCount % 5 === 0) {
			this.updateTarget(boss);
		}

		this.tryUnstuck(boss);
	}

	private readonly BOSS_EVENT_RANGE = 128;

	private getMaxMinions(boss: T): integer {
		return 64 * MathHelper.clamped(1, 3, this.getPlayers(boss).length);
	}

	private tryUnstuck(boss: T): void {
		const surface = boss.level.getHeightmapPos("motion_blocking_no_leaves", [boss.x, boss.y, boss.z]);
		if (boss.y > surface.y + 64) {
			boss.teleportTo(boss.x, surface.y + 32, boss.z);
		}
	}

	private trySmitePlayers(boss: T): void {
		const players = this.getPlayers(boss);
		for (const player of players) {
			if (Math.random() >= 0.5) continue;
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
		const toSpawn = Math.max(0, this.getMaxMinions(boss) - TenuemMinion.getBossCount(boss.server));
		if (toSpawn === 0) return false;

		Summonables.TENUEM_MINION.spawn(boss.level as any, pos);

		return true;
	}

	private updateTarget(boss: T): void {
		const nearestTankiestPlayer = ServerHelper.getSurvivors(boss.server)
			.filter(player => player.distanceToEntity(boss as any) < 128)
			.sort((a, b) => {
				const aTank = a.health + a.armorValue;
				const bTank = b.health + b.armorValue;
				return bTank - aTank;
			})[0];

		if (!nearestTankiestPlayer) return;
		boss.setTarget(nearestTankiestPlayer);
	}

})().register();