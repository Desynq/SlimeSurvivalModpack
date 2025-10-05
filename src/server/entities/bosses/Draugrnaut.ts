

/**
 * Boss damaging mechanic:
 */
// @ts-ignore
const Draugrnaut = new (class <T extends PathfinderMob_> extends BossManager<T> implements TickableBoss<T> {
	public readonly BOSS_ID = "mowziesmobs:ferrous_wroughtnaut";

	protected override isBoss(entity: unknown): entity is T {
		return entity instanceof $PathfinderMob && EntityHelper.isType(entity as any, this.BOSS_ID) && entity.tags.contains("boss.draugrnaut");
	}

	public getParticipantCount(boss: T): integer {
		if (!boss.target) return 0;
		return 1;
	}

	public getMaxHealth(boss: T): float {
		return 40;
	}

	public onBossTick(boss: T): void {
	}

	private onDamageTaken(boss: T): void {

	}
})().register();


EntityEvents.beforeHurt(Draugrnaut.BOSS_ID, event => {

});