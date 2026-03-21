// priority: 100

/**
 * Allows the entity to heal when players heal
 */
class MimicHealBehavior<
	T extends LivingEntity_,
	M extends IBehavioralEntityManager<T>
> extends Behavior<M> {

	public constructor(
		private readonly deps: {
			getPlayers(boss: T): ServerPlayer_[];
			getBossData(boss: T): { lastHealths: Map_<string, number>; };
		}
	) {
		super();
	}

	public override register(): void {
		this.manager.events.tickAll.add((server, bosses) => {
			for (const boss of bosses) {
				this.tickHeal(boss);
			}
		});
	}

	private tickHeal(boss: T): void {
		if (!boss.alive) return;

		const players = this.deps.getPlayers(boss);
		const data = this.deps.getBossData(boss);
		const { healths, totalHealing } = this.calcHealing(players, data.lastHealths);
		data.lastHealths = healths;

		if (totalHealing <= 0) return;

		if (boss.health >= boss.maxHealth) return;

		const damageTaken = boss.maxHealth - boss.health;
		const healAmount = Math.min(totalHealing, damageTaken);

		boss.heal(healAmount);
	}

	private calcHealing(players: ServerPlayer_[], lastHealths: Map_<string, number>): {
		healths: Map_<string, number>;
		totalHealing: number;
	} {
		let totalHealing = 0;
		const healths = new $HashMap<string, number>();

		for (const player of players) {
			if (!player.alive) continue;

			const currHealth = player.health;
			const prevHealth = lastHealths.get(player.stringUUID) as number | null;

			if (prevHealth !== null) {
				const healthGained = Math.max(0, currHealth - prevHealth);
				totalHealing += healthGained;
			}

			healths.put(player.stringUUID, currHealth);
		}

		return {
			healths,
			totalHealing
		};
	}
}