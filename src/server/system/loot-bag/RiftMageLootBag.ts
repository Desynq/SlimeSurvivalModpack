// priority: 11



class RiftMageLootBag extends LootBag {

	public constructor() {
		super("rift_mage");
	}

	public override open(player: ServerPlayer_): void {
		PlaysoundHelper.playsound(player.level, player.position(), "entity.turtle.egg_break", "master", 1, 1);

		if (Math.random() < 0.1) this.giveUnique(player);
		PlayerHelper.give(player, "minecraft:ender_pearl", MathHelper.randInt(8, 16));
		PlayerHelper.give(player, "minecraft:shulker_shell", MathHelper.randInt(1, 4));
	}

	private readonly UNIQUES = [
		"twilightforest:ender_bow",
		"simplyswords:watcher_claymore",
		"simplyswords:watching_warglaive"
	];

	private giveUnique(player: ServerPlayer_): void {
		const uniques = this.UNIQUES.filter(unique =>
			!player.inventory.contains((stack: ItemStack_) => stack.id.toString() === unique)
		);

		const pool = uniques.length > 0 ? uniques : this.UNIQUES;
		const unique = ArrayHelper.random(pool);

		PlayerHelper.give(player, unique);
	}
}