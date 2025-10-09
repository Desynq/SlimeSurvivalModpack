



// @ts-ignore
const PatrolHelicopter = new (class <T extends ServerPlayer_> extends EntityManager<T> implements ITickableBoss<T> {
	public readonly BOSS_ID = "minecraft:player";

	protected override isEntity(entity: unknown): entity is T {
		return entity instanceof $ServerPlayer && entity.tags.contains("boss.patrol_helicopter");
	}

	public override onIncomingDamage(boss: T, event: LivingIncomingDamageEvent_): void {
		if (event.source.getType() === "thorns") {
			event.setCanceled(true);
			return;
		}
	}

	public onBossTick(boss: T): void {
	}
})().register();