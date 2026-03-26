// priority: 899

namespace CustomItems {
	new CustomItem({
		id: "rottencreatures:dead_beard_head",
		lootPath: "dead_beard_head",
		customId: "dead_beard_head",
		components: {
			"minecraft:attribute_modifiers": {
				modifiers: [
					{
						type: "minecraft:generic.max_health",
						operation: "add_multiplied_total",
						amount: 1.0,
						id: `minecraft:armor.head`,
						slot: "head"
					},
					{
						type: "minecraft:generic.movement_speed",
						operation: "add_multiplied_total",
						amount: -0.5,
						id: `minecraft:armor.head`,
						slot: "head"
					},
					{
						type: "minecraft:generic.water_movement_efficiency",
						operation: "add_value",
						amount: 0.5,
						id: `minecraft:armor.head`,
						slot: "head"
					}
				]
			}
		}
	})
		.whileEquippedIn("head", (player) => {
			LivingEntityHelper.addEffect(
				player,
				"minecraft:hunger",
				19,
				0,
				false,
				true,
				true
			);
		})
		.pushOnto(CUSTOM_ITEMS);
}