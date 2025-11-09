// priority: 2

class TenuemLootBag extends LootBag {

	public constructor() {
		super("tenuem");
	}

	public override open(player: ServerPlayer_): void {
		PlaysoundHelper.playsound(player.level, player.position(), "entity.turtle.egg_break", "master", 1, 1);

		switch (MathHelper.randInt(0, 4)) {
			case 0:
				LootTableHelper.giveLoot(player, "slimesurvival:items/misc/tenuem_head");
				break;
			case 1:
				PlayerHelper.give(player, "simplyswords:storms_edge");
				break;
			case 2:
				PlayerHelper.give(player, "simplyswords:stormbringer");
				break;
			case 3:
				PlayerHelper.give(player, "simplyswords:thunderbrand");
				break;
			case 4:
				PlayerHelper.give(player, "simplyswords:mjolnir");
				break;
		}
	}
}