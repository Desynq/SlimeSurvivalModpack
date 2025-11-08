// priority: 1

class QueenBeeRewarder<T extends Bee_> extends BossRewarder<T> {

	public constructor() {
		super(1);
	}

	protected override rewardPlayer(boss: T, player: ServerPlayer_): void {
		super.rewardPlayer(boss, player);
		LootTableHelper.giveLoot(player, "slimesurvival:items/loot_bag/queen_bee");
	}
}