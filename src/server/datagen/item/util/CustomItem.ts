// priority: 900


type DataComponentValue =
	| string
	| number
	| boolean
	| string[]
	| number[]
	| boolean[]
	| DataComponent
	| DataComponent[];

interface DataComponent {
	[key: string]: DataComponentValue;
}

type Ingredient = { item: string; } | { tag: string; };

interface RegisteredCustomItem {
	writeLootTable(): void;
}

class CustomItem implements RegisteredCustomItem {
	private readonly lootPath: string;
	public readonly id: string;
	public readonly components: DataComponent;
	public readonly customId?: string;

	public constructor(
		{
			id,
			lootPath,
			components = {},
			customId
		}: {
			id: string;
			lootPath: string;
			components?: DataComponent;
			customId?: string;
		}
	) {
		this.id = id;
		this.components = components;
		this.lootPath = "slimesurvival:item/" + lootPath;

		this.customId = customId;
		if (customId !== undefined) {
			RecordHelper.getOrCreate(this.components, "minecraft:custom_data")["id"] = customId;
		}
	}

	public register(arr: Pushable<RegisteredCustomItem>): this {
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

	public whileEquippedIn(slot: $EquipmentSlot$$Type, handler: (player: ServerPlayer_, stack: ItemStack_) => void): this {
		if (this.customId === undefined) throw new Error("Cannot check for an item with no custom id");

		CustomItems.subscribe(slot, this.customId, handler);

		return this;
	}
}

namespace CustomItems {
	export const ITEM_REGISTRY: RegisteredCustomItem[] = [];


	type ItemHandler = (player: ServerPlayer_, stack: ItemStack_) => void;

	export const SLOT_BUSES = new Map<$EquipmentSlot$$Type, Map<string, ItemHandler[]>>();

	export function subscribe(
		slot: $EquipmentSlot$$Type,
		customId: string,
		handler: ItemHandler
	): void {
		let slotBus = SLOT_BUSES.get(slot);

		if (!slotBus) {
			slotBus = new Map();
			SLOT_BUSES.set(slot, slotBus);
		}

		let handlers = slotBus.get(customId);

		if (!handlers) {
			handlers = [];
			slotBus.set(customId, handlers);
		}

		handlers.push(handler);
	}

	PlayerEvents.tick(event => {
		const player = event.player as ServerPlayer_;

		SLOT_BUSES.forEach((slotBus, slot) => {
			const stack = player.getItemBySlot(slot);

			const id = StackHelper.getCustomId(stack);

			if (!id) return;

			// necessary due to Map not coercing Java String to JS string
			const handlers = slotBus.get("" + id);

			if (!handlers) return;

			for (const handler of handlers) {
				handler(player, stack);
			}
		});
	});





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
				.addShapedRecipe(this.key, pattern)
				.register(ITEM_REGISTRY);
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

	export const ARMOR = ["helmet", "chestplate", "leggings", "boots"] as const;

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

		item.register(ITEM_REGISTRY);

		return item;
	});
}