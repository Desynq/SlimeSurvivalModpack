

const Aptrgangr = new (class <T extends Mob_ & LivingEntity_> extends EntityManager<T> implements ITickableBoss<T> {
	public readonly BOSS_ID = "cataclysm:aptrgangr";

	public override isEntity(entity: unknown): entity is T {
		return entity instanceof $PathfinderMob && EntityHelper.isType(entity as any, this.BOSS_ID) && entity.tags.contains("boss.aptrgangr");
	}

	public override onIncomingDamage(boss: T, event: LivingIncomingDamageEvent_): void {
		const damageType = event.source.getType();
		if (["onFire", "inFire"].includes(damageType)) {
			event.setCanceled(true);
		}
	}

	public onBossTick(boss: T): void {
		this.updateTarget(boss);
	}

	private updateTarget(boss: T): void {
		const survivorDistances = BossHelper.getSurvivorDistances(boss, 128);
		if (survivorDistances.length === 0) return;

		const nearestPlayer = ArrayHelper.getLowest(
			survivorDistances,
			sd => {
				return (sd.distance ** 1.5) / (sd.player.maxHealth + 1e-6);
			}
		).player;

		boss.setTarget(nearestPlayer);
	}
})().register();
