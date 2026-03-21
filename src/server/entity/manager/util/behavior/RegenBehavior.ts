// priority: 100

class RegenBehavior<
	T extends LivingEntity_,
	M extends IBehavioralEntityManager<T>
> extends Behavior<M> {
	protected readonly baseHeal: number;

	public constructor(heal: number = 1) {
		super();
		this.baseHeal = heal;
	}

	public override register(): void {
		this.manager.events.tickAll.add((server, bosses) => {
			for (const boss of bosses) {
				this.heal(boss);
			}
		});
	}

	private heal(boss: T): void {
		if (!boss.alive) return;

		if (boss.health >= boss.maxHealth) return;

		const damageTaken = boss.maxHealth - boss.health;
		const healAmount = Math.min(this.baseHeal, damageTaken);
		boss.heal(healAmount);
	}
}


/**
 * Conditionally heal whenever a survival-like player dies
 */
class HealOnPlayerDeathBehavior<
	T extends LivingEntity_,
	M extends IBehavioralEntityManager<T>
> extends Behavior<M> {

	public constructor(
		private readonly deps: {
			getEntities: (server: MinecraftServer_) => T[];
			calcHeal: (boss: T, pd: PlayerDistance, event: LivingEntityDeathKubeEvent_) => number | null;
		}
	) {
		super();
	}

	public override register(): void {
		this.manager.events.playerDeath.add((player, event) => {
			if (!PlayerHelper.isSurvivalLike(player)) return;

			const bosses = this.deps.getEntities(event.server);
			for (const boss of bosses) {
				const pd: PlayerDistance = {
					player,
					distance: this.calcDeathDistance(player, boss)
				};

				const healAmount = this.deps.calcHeal(boss, pd, event);
				if (healAmount === null) continue;

				LivingEntityHelper.heal(boss, healAmount);
			}
		});
	}

	private calcDeathDistance(player: ServerPlayer_, boss: T): number {
		if (!player.level.dimension.equals(boss.level.dimension)) {
			return Number.MAX_VALUE;
		}

		// const dist = deathLoc.pos().center.distanceTo(boss.pos);
		const dist = player.position().distanceTo(boss.position() as any);
		return dist;
	}
}