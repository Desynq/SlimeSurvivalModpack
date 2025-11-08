// priority: 1

abstract class SpawnEntry {

	public abstract getSummonable(event: CheckLivingEntitySpawnKubeEvent_): Summonable;

	public abstract getChance(event: CheckLivingEntitySpawnKubeEvent_): Percent;
}

class FixedSpawnEntry extends SpawnEntry {

	public constructor(
		private readonly summonable: Summonable,
		private readonly chance: Percent
	) {
		super();
	}

	public getSummonable(): Summonable {
		return this.summonable;
	}

	public getChance(): Percent {
		return this.chance;
	}
}

class CappedSpawnEntry extends SpawnEntry {

	/**
	 * @param tag `summonable` must have this tag as well
	 */
	public constructor(
		private readonly summonable: Summonable,
		private readonly chance: Percent,
		private readonly distance: double,
		private readonly tag: string,
		private readonly cap: integer
	) {
		super();
	}

	public override getSummonable(): Summonable {
		return this.summonable;
	}

	public override getChance(event: CheckLivingEntitySpawnKubeEvent_): Percent {
		const cond = (entity: LivingEntity_) => entity.tags.contains(this.tag);
		const count = LevelHelper.countEntities(event.level as ServerLevel_, event.entity.pos as any, this.distance, $LivingEntity, cond, this.cap);

		if (count >= this.cap) {
			return 0.0;
		}
		return this.chance;
	}
}

class DynamicSpawnEntry extends SpawnEntry {

	public constructor(
		private readonly summonableGetter: (event: CheckLivingEntitySpawnKubeEvent_) => Summonable,
		private readonly chanceGetter: (event: CheckLivingEntitySpawnKubeEvent_) => Percent
	) {
		super();
	}

	public override getSummonable(event: CheckLivingEntitySpawnKubeEvent_): Summonable {
		return this.summonableGetter(event);
	}

	public override getChance(event: CheckLivingEntitySpawnKubeEvent_): Percent {
		return this.chanceGetter(event);
	}
}