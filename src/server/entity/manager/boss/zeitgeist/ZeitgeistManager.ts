// priority: 1


interface ZeitgeistData {
	lastHealths: Map_<string, { health: number; }>;
}

class ZeitgeistManager<T extends LivingEntity_>
	extends BehavioralEntityManager<T> {

	private readonly dataMap: Map_<string, ZeitgeistData> = new $HashMap<string, ZeitgeistData>();

	private readonly BOSS_EVENT_RANGE = 48;



	public override isEntity(entity: unknown): entity is T {
		return entity instanceof $LivingEntity && entity.tags.contains("boss.zeitgeist");
	}

	public override onLeave(boss: T, event: EntityLeaveLevelEvent_): void {
		this.dataMap.remove(boss.stringUUID);
		super.onLeave(boss, event);
	}

	protected override initBehaviors(): void {
		this.addBehaviors(
			new MimicHealBehavior(this),
			new HealOnPlayerDeathBehavior({
				getEntities: (server) => this.getEntities(server),
				calcHeal: (boss, pd, event) => {
					if (pd.distance > this.BOSS_EVENT_RANGE) return null;
					return boss.maxHealth * 0.1;
				}
			}),
			new TeleportOnHitBehavior({
				calcTp: (boss) => {
					if (boss.inWater) return null;
					return { radius: 16 };
				}
			}),
			new RewardBehavior(new LootBagRewarder(1, LootBags.ZEITGEIST))
		);
	}





	public getPlayers(boss: T): ServerPlayer_[] {
		const sds = BossHelper.getSurvivorDistances(boss, this.BOSS_EVENT_RANGE);
		return sds.map(sd => sd.player);
	}

	public getBossData(boss: T): ZeitgeistData {
		let data = this.dataMap.get(boss.stringUUID) as ZeitgeistData | null;
		if (data === null) {
			data = {
				lastHealths: new $HashMap<string, { health: number; }>()
			};

			this.dataMap.put(boss.stringUUID, data);
		}

		return data;
	}
}

new ZeitgeistManager().register();