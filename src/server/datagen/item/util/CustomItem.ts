// priority: 1000



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
					LootEntry.of(this.id).jsonFunction({
						function: "minecraft:set_components",
						components: this.components
					})
				);
			});
		});
	}

	public addShapedRecipe(pattern: string[], key: Record<string, Ingredient | Ingredient[]>): this {
		ServerEvents.recipes(e => {
			e.custom({
				type: "minecraft:crafting_shaped",
				key,
				pattern,
				result: {
					id: this.id,
					count: 1,
					components: this.components
				}
			});
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
				.addShapedRecipe(pattern, this.key);
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
					}
				]
			}
		})
	});

	axolotl.create({
		type: "helmet",
		display: "Helmet",
		maxDamage: 165,
		armor: 2,
		pattern: [
			"000",
			"0 0"
		]
	});
	axolotl.create({
		type: "chestplate",
		display: "Chestplate",
		maxDamage: 240,
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
		maxDamage: 225,
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
		maxDamage: 195,
		armor: 2,
		pattern: [
			"0 0",
			"0 0"
		]
	});
}