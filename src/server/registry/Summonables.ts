// priority: 1

namespace Summonables {
	const SLIMIFIED_ARMOR = [
		{},
		{},
		{},
		{
			id: "minecraft:slime_block",
			count: 1
		}
	];
	export const SLIMIFIED_ZOMBIE = Summonable.create("slimified_zombie", "minecraft:zombie", {
		PersistenceRequired: true,
		attributes: [
			{
				id: "minecraft:generic.movement_speed",
				base: 0.3
			}
		],
		ArmorItems: SLIMIFIED_ARMOR,
		ArmorDropChances: [0.0, 0.0, 0.0, 1.0],
		CustomName: '{"color":"dark_green","text":"Slimified Zombie"}'
	});
	SLIMIFIED_ZOMBIE.setMaxHealth(40.0);

	export const SLIMIFIED_SKELETON = Summonable.create("slimified_skeleton", "minecraft:skeleton", {
		PersistenceRequired: true,
		attributes: [
			{
				id: "minecraft:generic.movement_speed",
				base: 0.3
			}
		],
		ArmorItems: SLIMIFIED_ARMOR,
		HandItems: [
			{},
			{
				id: "minecraft:bow",
				count: 1
			}
		],
		CustomName: '{"color":"dark_green","text":"Slimified Skeleton"}'
	});
	SLIMIFIED_SKELETON.setMaxHealth(40.0);

	export const THE_COLOSSUS = Summonable.create("the_colossus", "minecraft:slime", {
		PersistenceRequired: true,
		Size: 10,
		attributes: [
			{
				id: "minecraft:generic.attack_damage",
				base: 0.3
			}
		],
		ArmorItems: SLIMIFIED_ARMOR,
		HandItems: [
			{},
			{
				id: "minecraft:bow",
				count: 1
			}
		],
		CustomName: '{"color":"dark_green","text":"Slimified Skeleton"}'
	});
	SLIMIFIED_SKELETON.setMaxHealth(40.0);

	export const QUEEN_BEE = Summonable.create("queen_bee", "minecraft:bee", {
		PersistenceRequired: true,
		attributes: [
			{
				id: "minecraft:generic.scale",
				base: 3
			}
		],
		CustomName: '{"color":"yellow","text":"The Queen Bee"}'
	})
		.setMaxHealth(1000.0)
		.setBoss("queen_bee");

	export const THE_HUNGER = Summonable.create("the_hunger", "minecraft:rabbit", {
		PersistenceRequired: true,
		attributes: [
			{
				id: "minecraft:generic.attack_damage",
				base: 6
			},
			{
				id: "minecraft:generic.movement_speed",
				base: 0.5
			},
			{
				id: "minecraft:generic.fall_damage_multiplier",
				base: 0.0
			}
		],
		CustomName: '{"color":"dark_red","text":"The Hunger"}',
		RabbitType: 99,
		Glowing: true
	})
		.setMaxHealth(6.0)
		.setBoss("the_hunger");

	export const THE_IMMORTAL = Summonable.create("the_immortal", "rottencreatures:immortal", {
		PersistenceRequired: true,
		attributes: [
			{
				id: "minecraft:generic.attack_damage",
				base: 20
			},
			{
				id: "minecraft:generic.armor",
				base: 20
			}
		],
		CustomName: '{"color":"dark_aqua","text":"The Immortal"}',
		Glowing: true
	})
		.setMaxHealth(10000.00)
		.setBoss("the_immortal");

	export const ZAPPY = Summonable.create("zappy", "rottencreatures:zap", {
		PersistenceRequired: true,
		attributes: [
			{
				id: "minecraft:generic.attack_damage",
				base: 5
			},
			{
				id: "minecraft:generic.armor",
				base: 20
			},
			{
				id: "minecraft:generic.movement_speed",
				base: 0.5
			}
		],
		CustomName: '{"color":"dark_aqua","text":"Zappy"}',
		Glowing: true
	})
		.setMaxHealth(40.00);

	export const TENUEM_BOSS = Summonable.create("tenuem_boss", "minecraft:phantom", {
		PersistenceRequired: true,
		attributes: [
			{
				id: "minecraft:generic.attack_damage",
				base: 100
			},
			{
				id: "minecraft:generic.scale",
				base: 3
			}
		],
		CustomName: '{"color":"dark_aqua","text":"The Tenuem"}',
		Glowing: true
	})
		.setMaxHealth(10_000.00)
		.setBoss("tenuem");

	export const TENUEM_MINION = Summonable.create("tenuem_minion", "minecraft:phantom", {
		PersistenceRequired: true,
		attributes: [
			{
				id: "minecraft:generic.attack_damage",
				base: 8
			}
		],
		CustomName: '{"color":"dark_aqua","text":"Tenuem Minion"}'
	})
		.setMaxHealth(20.00)
		.setCustomEntity("tenuem_minion");



	export const RIFT_MAGE = Summonable.create("rift_mage", "minecraft:stray", {
		PersistenceRequired: true,
		attributes: [
			{
				id: "minecraft:generic.attack_damage",
				base: 10
			},
			{
				id: "minecraft:generic.movement_speed",
				base: 0.3
			},
			{
				id: "minecraft:generic.armor",
				base: 20
			}
		],
		active_effects: [
			{
				id: "minecraft:fire_resistance",
				duration: -1,
				amplifier: 0,
				ambient: false,
				show_icon: false,
				show_particles: false
			}
		],
		CustomName: '{"color":"dark_purple","text":"Rift Mage"}',
		HandItems: [
			{
				id: "minecraft:bow",
				count: 1
			}
		]
	})
		.setMaxHealth(RiftMage.DEFAULT_MAX_HEALTH)
		.setBoss();

	export const HOG_RIDER = Summonable.create("hog_rider", "minecraft:hoglin", {
		Passengers: [
			{
				id: "minecraft:piglin",
				HandItems: [
					{
						id: "minecraft:crossbow",
						count: 1,
						components: {
							"minecraft:enchantments": {
								levels: {
									"minecraft:power": 5,
									"minecraft:piercing": 3
								}
							}
						}
					}
				],
				attributes: [
					{
						id: "minecraft:generic.armor",
						base: 20
					}
				]
			}
		]
	})
		.setMaxHealth(100);

	export const IGNITIUM = Summonable.create("ignitium", "cataclysm:ignis", {
		attributes: [
			{
				id: "minecraft:generic.armor",
				base: 100
			},
			{
				id: "minecraft:generic.armor_toughness",
				base: 10
			},
			{
				id: "minecraft:generic.attack_damage",
				base: 100
			}
		]
	})
		.setMaxHealth(50_000)
		.setBoss("ignitium");

	export const RIFT_KNIGHT = Summonable.create("rift_knight", "minecraft:wither_skeleton", {
		CustomName: `"Rift Knight"`
	})
		.setHandItems("minecraft:netherite_axe")
		.setArmorItems("minecraft:netherite_boots", "minecraft:netherite_leggings", "minecraft:netherite_chestplate", "minecraft:netherite_helmet")
		.setMaxHealth(40)
		.addAttribute("minecraft:generic.attack_damage", 20)
		.addAttribute("minecraft:generic.movement_speed", 0.2);

	export const RIFT_SCOUT = Summonable.create("rift_scout", "minecraft:wither_skeleton", {
		CustomName: `"Rift Scout"`
	})
		.setHandItems("minecraft:bow")
		.setArmorItems(undefined, undefined, undefined, "minecraft:netherite_helmet")
		.setMaxHealth(100)
		.addAttribute("minecraft:generic.attack_damage", 20)
		.addAttribute("minecraft:generic.movement_speed", 0.4);

	export const RIFT_PALADIN = Summonable.create("rift_paladin", "minecraft:wither_skeleton", {
		CustomName: `"Rift Paladin"`
	})
		.setHandItems("minecraft:netherite_sword", "minecraft:shield")
		.setArmorItems("minecraft:netherite_boots", "minecraft:netherite_leggings", "minecraft:netherite_chestplate", "minecraft:netherite_helmet")
		.setMaxHealth(100)
		.addAttribute("minecraft:generic.attack_damage", 100)
		.addAttribute("minecraft:generic.movement_speed", 0.1);

	export const RIFT_PALADINDROME = Summonable.create("rift_paladindrome", "minecraft:wither_skeleton", {
		CustomName: `"Rift Palindrome"`,
		Glowing: true
	})
		.setHandItems("minecraft:netherite_sword", "minecraft:netherite_sword")
		.setArmorItems("minecraft:netherite_boots", "minecraft:netherite_leggings", "minecraft:netherite_chestplate", "minecraft:netherite_helmet")
		.setMaxHealth(1001)
		.addAttribute("minecraft:generic.attack_damage", 101)
		.addAttribute("minecraft:generic.armor", 1)
		.addAttribute("minecraft:generic.movement_speed", 0.2)
		.setBoss("palindrome");
}