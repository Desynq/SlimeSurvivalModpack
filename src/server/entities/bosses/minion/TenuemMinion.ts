

// @ts-ignore
const TenuemMinion = new (class <T extends Phantom_> extends BossManager<T> implements ITickableBoss<T> {

	public override isBoss(entity: unknown): entity is T {
		return entity instanceof $Phantom && entity.tags.contains("entity.tenuem_minion");
	}

	public override onIncomingDamage(minion: T, event: LivingIncomingDamageEvent_): void {
		if (["lightningBolt", "inFire", "onFire"].includes(event.source.getType())) {
			event.setCanceled(true);
		}
	}

	public onBossTick(minion: T): void {
		const bossNearby = TheTenuem.getBosses(minion.server).some(boss => boss.distanceToEntity(minion as any) < 128);
		if (!bossNearby) {
			minion.discard();
			return;
		}

		if (minion.server.tickCount % 5 === 0) {
			this.updateTarget(minion);
		}
	}

	// TODO: Make it biased towards closer players so they don't cross-map to the dps
	private updateTarget(minion: T): void {
		const nearestTankiestPlayer = ServerHelper.getSurvivors(minion.server)
			.filter(player => player.distanceToEntity(minion as any) < 128)
			.sort((a, b) => {
				const aTank = a.health + a.armorValue;
				const bTank = b.health + b.armorValue;
				return aTank - bTank;
			})[0];

		if (!nearestTankiestPlayer) return;
		minion.setTarget(nearestTankiestPlayer);
	}
})().register();