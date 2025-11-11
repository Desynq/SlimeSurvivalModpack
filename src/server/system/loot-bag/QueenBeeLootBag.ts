// priority: 2

class QueenBeeLootBag extends LootBag {

	public constructor() {
		super("queen_bee");
	}

	public override open(player: ServerPlayer_): void {
		PlaysoundHelper.playsound(player.level, player.position(), "entity.turtle.egg_break", "master", 1, 1);

		if (Math.random() < 0.1) this.giveUnique(player);
		PlayerHelper.give(player, "minecraft:honeycomb", MathHelper.randInt(8, 32));
		PlayerHelper.give(player, "minecraft:honey_block", MathHelper.randInt(1, 4));
		PlayerHelper.give(player, "slimesurvival:royal_jelly", MathHelper.randInt(5, 15));
	}

	private readonly UNIQUES = [
		"simplyswords:waxweaver",
		"simplyswords:wickpiercer",
		"simplyswords:hiveheart"
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