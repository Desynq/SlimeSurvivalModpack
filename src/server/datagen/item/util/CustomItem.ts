// priority: 900



type Ingredient = { item: string; } | { tag: string; };

class CustomItem {
	private readonly lootPath: string;
	public readonly id: string;
	public readonly components: Record<string, any>;

	public constructor(
		{
			id,
			components = {},
			lootPath
		}: {
			id: string;
			components: Record<string, any>;
			lootPath: string;
		}
	) {
		this.id = id;
		this.components = components;
		this.lootPath = "slimesurvival:item/" + lootPath;
	}

	public pushOnto(arr: CustomItem[]): this {
		arr.push(this);
		return this;
	}

	public writeLootTable(): void {
		LootJS.lootTables(e => {
			e.create(this.lootPath).createPool(pool => {
				pool.addEntry(
					// @ts-ignore
					LootEntry.of(this.id).jsonFunction({
						function: "minecraft:set_components",
						components: this.components
					})
				);
			});
		});
	}

	public addShapedRecipe(key: Record<string, Ingredient | Ingredient[]>, ...patterns: string[][]): this {
		ServerEvents.recipes(e => {
			for (const pattern of patterns) {
				e.custom({
					type: "minecraft:crafting_shaped",
					key,
					pattern: pattern,
					result: {
						id: this.id,
						count: 1,
						components: this.components
					}
				});
			}
		});

		return this;
	}
}

namespace CustomItems {
	export const ITEMS: CustomItem[] = [];


	interface BaseItems {
		helmet: string;
		chestplate: string;
		leggings: string;
		boots: string;
	}

	type ArmorFactoryCreationSettings = {
		type: "helmet" | "chestplate" | "leggings" | "boots";
		display: string;
		maxDamage: number;
		armor: number;
		pattern: string[];
	};

	class ArmorFactory {
		private readonly slots = {
			helmet: "head",
			chestplate: "chest",
			leggings: "legs",
			boots: "feet"
		};

		private readonly componentizer: (settings: ArmorFactoryCreationSettings & { slot: string; }) => Record<string, any>;
		private readonly baseItems: BaseItems;
		private readonly key: Record<string, Ingredient | Ingredient[]>;
		private readonly baseLootPath: string;

		public constructor({
			componentizer,
			baseItems,
			key,
			baseLootPath
		}: {
			componentizer: (settings: ArmorFactoryCreationSettings & { slot: string; }) => Record<string, any>,
			baseItems: BaseItems;
			key: Record<string, Ingredient | Ingredient[]>;
			baseLootPath: string;
		}) {
			this.componentizer = componentizer;
			this.baseItems = baseItems;
			this.key = key;
			this.baseLootPath = baseLootPath;
		}

		public create({
			type,
			display,
			maxDamage,
			armor,
			pattern
		}: ArmorFactoryCreationSettings): CustomItem {
			const slot = this.slots[type];
			const baseItem = this.baseItems[type];

			return new CustomItem({
				id: baseItem,
				lootPath: `${this.baseLootPath}_${type}`,
				components: this.componentizer({ type, display, maxDamage, armor, pattern, slot })
			})
				.pushOnto(ITEMS)
				.addShapedRecipe(this.key, pattern);
		}
	}


	const axolotl = new ArmorFactory({
		baseLootPath: "axolotl",
		baseItems: {
			helmet: "minecraft:leather_helmet",
			chestplate: "minecraft:leather_chestplate",
			leggings: "minecraft:leather_leggings",
			boots: "minecraft:leather_boots"
		},
		key: {
			0: {
				item: "slimesurvival:axolotl_gills"
			}
		},
		componentizer: ({ display, maxDamage, armor, type, slot }) => ({
			"minecraft:item_name": `{"color":"#FFB6C1","text":"Axolotl ${display}"}`,
			"minecraft:dyed_color": {
				rgb: 16758465
			},
			"minecraft:max_damage": maxDamage,
			"minecraft:custom_data": {
				custom_armor: true,
				axolotl_armor: true
			},
			"minecraft:attribute_modifiers": {
				modifiers: [
					{
						type: "minecraft:generic.armor",
						operation: "add_value",
						amount: armor,
						id: `slimesurvival:armor.${type}`,
						slot
					},
					{
						type: "minecraft:generic.max_health",
						operation: "add_multiplied_base",
						amount: 0.125,
						id: `slimesurvival:armor.${type}`,
						slot
					}
				]
			}
		})
	});

	axolotl.create({
		type: "helmet",
		display: "Helmet",
		maxDamage: 500,
		armor: 2,
		pattern: [
			"000",
			"0 0"
		]
	});
	axolotl.create({
		type: "chestplate",
		display: "Chestplate",
		maxDamage: 800,
		armor: 6,
		pattern: [
			"0 0",
			"000",
			"000"
		]
	});
	axolotl.create({
		type: "leggings",
		display: "Leggings",
		maxDamage: 700,
		armor: 5,
		pattern: [
			"000",
			"0 0",
			"0 0"
		]
	});
	axolotl.create({
		type: "boots",
		display: "Boots",
		maxDamage: 400,
		armor: 2,
		pattern: [
			"0 0",
			"0 0"
		]
	});

	const ARMOR = ["helmet", "chestplate", "leggings", "boots"] as const;

	zipRecord({
		baseItem: [
			"minecraft:leather_helmet",
			"minecraft:leather_chestplate",
			"minecraft:leather_leggings",
			"minecraft:leather_boots"
		],
		lootPath: ARMOR.map(a => "turtle_" + a),
		display: [
			"Helmet",
			"Chestplate",
			"Leggings",
			"Boots"
		],
		maxDamage: [
			1000,
			1600,
			1400,
			800
		],
		armor: [
			3,
			8,
			6,
			3
		],
		slot: [
			"head",
			"chest",
			"legs",
			"feet"
		],
		type: ARMOR,
		pattern: [
			[
				"000",
				"010"
			],
			[
				"010",
				"000",
				"000"
			],
			[
				"000",
				"010",
				"0 0"
			],
			[
				[
					"0 0",
					"010"
				],
				[
					"010",
					"0 0"
				]
			]
		]
	}, ({ baseItem, lootPath, display, maxDamage, armor, slot, type, pattern }) => {
		const key = {
			0: {
				item: "minecraft:turtle_scute"
			},
			1: {
				item: "minecraft:leather"
			}
		};
		const item = new CustomItem({
			id: baseItem,
			lootPath,
			components: {
				"minecraft:item_name": `{"color":"#46BD49","text":"Turtle ${display}"}`,
				"minecraft:dyed_color": {
					rgb: 4635977
				},
				"minecraft:max_damage": maxDamage,
				"minecraft:custom_data": {
					custom_armor: true,
					turtle_armor: true
				},
				"minecraft:attribute_modifiers": {
					modifiers: [
						{
							type: "minecraft:generic.armor",
							operation: "add_value",
							amount: armor,
							id: `slimesurvival:armor.${type}`,
							slot
						},
						{
							type: "minecraft:generic.armor_toughness",
							operation: "add_value",
							amount: 2,
							id: `slimesurvival:armor.${type}`,
							slot
						},
						{
							type: "minecraft:generic.knockback_resistance",
							operation: "add_value",
							amount: 0.125,
							id: `slimesurvival:armor.${type}`,
							slot
						}
					]
				}
			}
		});

		item.addShapedRecipe(key, ...ArrayHelper.to2D(pattern));

		item.pushOnto(ITEMS);

		return item;
	});
}