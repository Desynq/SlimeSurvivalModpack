

// @ts-ignore
const TenuemMinion = new (class <T extends Phantom_> extends BossManager<T> implements ITickableBoss<T> {

	public override isBoss(entity: unknown): entity is T {
		return entity instanceof $Phantom && entity.tags.contains("entity.tenuem_minion");
	}

	public override onIncomingDamage(boss: T, event: LivingIncomingDamageEvent_): void {
		if (["lightningBolt", "inFire", "onFire"].includes(event.source.getType())) {
			event.setCanceled(true);
		}
	}

	public onBossTick(minion: T): void {
		const bossNearby = TheTenuem.getBosses(minion.server).some(boss => boss.distanceToEntity(minion as any) < 64);
		if (!bossNearby) {
			minion.discard();
		}
	}
})().register();