// priority: 11

class ZeitgeistLootBag extends LootBag {

	public constructor() {
		super("zeitgeist");
	}

	public override open(player: ServerPlayer_): void {
		PlaysoundHelper.playsound(player.level, player.position(), "entity.turtle.egg_break", "master", 1, 1);

		PlayerHelper.give(player, "slimesurvival:axolotl_gills", MathHelper.randInt(4, 8));
		PlayerHelper.give(player, "minecraft:turtle_scute", MathHelper.randInt(4, 8));
		PlayerHelper.give(player, "minecraft:tropical_fish", MathHelper.randInt(12, 48));

		if (Math.random() < 0.5) {
			PlayerHelper.give(player, "slimesurvival:lesser_unbreaking_tome");
		}

		if (Math.random() < 0.25) this.giveUnique(player);
	}

	private readonly UNIQUES: UniqueLoot[] = [
		UniqueLoot.asId("simplyswords:chompolotl"),
		UniqueLoot.asNbt({
			id: "minecraft:fishing_rod",
			customId: "golden_rod",
			nbt: `[custom_data={id:"golden_rod"},enchantments={levels:{lure:5,luck_of_the_sea:5}},item_name='{"color":"gold","text":"Golden Rod"}']`
		}),
		UniqueLoot.asNbt({
			id: "cataclysm:coral_spear",
			customId: "abyssal_spear",
			nbt: `[custom_data={id:"abyssal_spear"},enchantments={levels:{loyalty:3,impaling:10}},item_name='{"color":"dark_aqua","text":"Abyssal Spear"}']`
		})
	];

	private giveUnique(player: ServerPlayer_): void {
		const uniques = this.UNIQUES.filter(unique => !unique.has(player));

		// default to all uniques if the player has all uniques
		const pool = uniques.length > 0 ? uniques : this.UNIQUES;

		const unique = ArrayHelper.random(pool);

		unique.give(player);
	}
}