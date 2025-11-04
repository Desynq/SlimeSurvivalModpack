// priority: 1

class LootBags {
	private static readonly LOOT_BAGS: Record<string, LootBag | undefined> = {};

	public static readonly TENUEM_LOOT_BAG = this.register(new TenuemLootBag());
	public static readonly QUEEN_BEE_LOOT_BAG = this.register(new QueenBeeLootBag());

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