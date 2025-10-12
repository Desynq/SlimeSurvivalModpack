

// @ts-ignore
const TenuemMinion = new (class <T extends Phantom_> extends EntityManager<T> implements ITickableBoss<T> {

	public override isEntity(entity: unknown): entity is T {
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

	private updateTarget(minion: T): void {
		const survivors: { player: ServerPlayer_, distance: double; }[] = [];
		for (const survivor of ServerHelper.getSurvivors(minion.server)) {
			const distance = survivor.distanceToEntity(minion as any);
			if (distance >= 128) continue;
			survivors.push({ player: survivor, distance: distance });
		}
		if (survivors.length === 0) return;

		const nearest = ArrayHelper.getLowest(
			survivors,
			x => (x.player.health + x.player.armorValue) / (1 + x.distance / 32)
		).player;

		if (!nearest) return;
		minion.setTarget(nearest);
	}
})().register();