// priority: 100



class RewardBehavior<
	T extends LivingEntity_,
	M extends IBehavioralEntityManager<T>
> extends Behavior<M> {

	public constructor(
		protected readonly rewarder: BossRewarder<T> = new BossRewarder(1)
	) {
		super();
	}

	public override register(): void {

		this.manager.events.afterHurt.add((entity, event) => {
			const attacker = event.source.actual as Entity_ | null;
			if (attacker instanceof $ServerPlayer) {
				this.rewarder.addContributor(entity, attacker);
			}
		});

		this.manager.events.death.add((entity, event) => {
			if (event.source.getType() !== "genericKill") {
				this.rewarder.rewardContributors(entity);
				this.rewarder.resetContributors(entity);
			}
		});
	}
}