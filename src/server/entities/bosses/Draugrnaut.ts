


const Draugrnaut = new (class <T extends LivingEntity_> extends BossManager<T> implements TickableBoss<T> {
	public override isBoss(entity: unknown): entity is T {
		return entity instanceof $LivingEntity && EntityHelper.isType(entity, "mowziesmobs:ferrous_wroughtnaut") && entity.tags.contains("boss.draugrnaut");
	}


	public onBossTick(boss: T): void {
	}

	private spawnPhase1(boss: T): void {

	}
})().register();