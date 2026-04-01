// priority: 899

namespace CustomItems {
	zipRecord({
		baseItem: [
			"minecraft:leather_helmet",
			"minecraft:leather_chestplate",
			"minecraft:leather_leggings",
			"minecraft:leather_boots"
		],
		lootPath: ARMOR.map(a => "living_" + a),
		display: ["Helmet", "Chestplate", "Leggings", "Boots"],
		maxDamage: [500, 800, 700, 400],
		armor: [3, 8, 6, 3],
		slot: ["head", "chest", "legs", "feet"],
		type: ARMOR,
		pattern: [
			[
				"000",
				"0 0"
			],
			[
				"0 0",
				"000",
				"000"
			],
			[
				"000",
				"0 0",
				"0 0"
			],
			[
				"0 0",
				"0 0"
			]
		]
	}, ({ baseItem, lootPath, display, maxDamage, armor, slot, type, pattern }) => {
		const key = {
			0: {
				item: "slimesurvival:living_fiber"
			}
		};
		const item = new CustomItem({
			id: baseItem,
			lootPath,
			components: {
				"minecraft:item_name": `{"color":"#007700","text":"Living ${display}"}`,
				"minecraft:lore": [
					{ italic: false, color: "dark_green", text: "Partially absorbs damage as durability." },
					{ italic: false, color: "dark_green", text: "Regenerates durability slowly at the cost of hunger." }
				].map(x => JSON.stringify(x)),
				"minecraft:dyed_color": {
					rgb: 4635977
				},
				"minecraft:max_damage": maxDamage,
				"minecraft:custom_data": {
					custom_armor: true,
					no_unbreaking_tome: true,
					no_durability_unequip: true,
					living_armor: true
				},
				"minecraft:attribute_modifiers": {
					modifiers: [
						{
							type: "minecraft:generic.armor",
							operation: "add_value",
							amount: armor,
							id: `minecraft:armor.${slot}`,
							slot
						},
						{
							type: "minecraft:generic.armor_toughness",
							operation: "add_value",
							amount: 4,
							id: `minecraft:armor.${slot}`,
							slot
						},
						{
							type: "slimesurvival:movement_drag_coefficient",
							operation: "add_multiplied_base",
							amount: 0.25,
							id: `minecraft:armor.${slot}`,
							slot
						}
					]
				}
			}
		})
			.addShapedRecipe(key, ...ArrayHelper.to2D(pattern))
			.register(ITEM_REGISTRY);

		return item;
	});
}