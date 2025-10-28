// priority: 2

abstract class LootBag {

	protected readonly type: string;

	public constructor(
		public readonly id: string
	) {
		this.type = `lootbag.${id}`;
	}

	public abstract open(player: ServerPlayer_): void;
}

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



class LootBags {
	private static readonly LOOT_BAGS: Record<string, LootBag | undefined> = {};

	public static readonly TENUEM_LOOT_BAG = this.register(new TenuemLootBag());

	/**
	 * Clears the stack if successfully opened
	 * @param stack accepts any stack as it tries to resolve it to a loot bag at runtime
	 */
	public static tryOpen(player: ServerPlayer_, stack: ItemStack_): void {
		const id = this.getLootbagId(stack);
		if (id === undefined) return;

		const lootbag = this.LOOT_BAGS[id];
		if (lootbag === undefined) return;

		stack.setCount(0);
		lootbag.open(player);
	}

	private static getLootbagId(stack: ItemStack_): string | undefined {
		const id = StackHelper.getCustomId(stack);
		if (id === undefined) return undefined;

		const path = id.split("\\.", 2)[1];
		return path;
	}

	public static register<T extends LootBag>(lootbag: T): T {
		this.LOOT_BAGS[lootbag.id] = lootbag;
		return lootbag;
	}
}