// priority: 99

class LootBagRewarder<T extends LivingEntity_> extends BossRewarder<T> {

	private readonly lootbagId: string;

	public constructor(
		racePoints: integer,
		lootbag: LootBag
	) {
		super(racePoints);
		this.lootbagId = "slimesurvival:items/loot_bag/" + lootbag.id;
	}

	protected override rewardPlayer(boss: T, player: ServerPlayer_): void {
		super.rewardPlayer(boss, player);
		LootTableHelper.giveLoot(player, this.lootbagId);
	}
}