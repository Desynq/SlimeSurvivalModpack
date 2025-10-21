// priority: 2

abstract class RewardableEntityManager<T extends LivingEntity_> extends EntityManager<T> {

	public constructor(
		protected readonly rewarder: BossRewarder<T> = new BossRewarder(1)
	) {
		super();
	}

	public override onAfterHurt(entity: T, event: AfterLivingEntityHurtKubeEvent_): void {
		super.onAfterHurt(entity, event);
		const attacker = event.source.actual as Entity_ | null;
		if (attacker instanceof $ServerPlayer) {
			this.rewarder.addContributor(entity, attacker);
		}
	}

	public override onDeath(entity: T, event: LivingEntityDeathKubeEvent_): void {
		super.onDeath(entity, event);
		this.rewarder.rewardContributors(entity);
	}
}