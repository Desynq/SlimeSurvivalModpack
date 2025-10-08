



// @ts-ignore
const Draugrnaut = new (class <T extends ServerPlayer_> extends BossManager<T> implements ITickableBoss<T> {
	public readonly BOSS_ID = "minecraft:player";

	protected override isBoss(entity: unknown): entity is T {
		return entity instanceof $ServerPlayer && entity.tags.contains("boss.patrol_helicopter");
	}

	public onIncomingDamage(boss: T, event: LivingIncomingDamageEvent_): void {
		if (event.source.getType() === "thorns") {
			event.setCanceled(true);
			return;
		}
	}

	public onBossTick(boss: T): void {
	}
})().register();