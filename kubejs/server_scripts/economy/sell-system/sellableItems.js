/**
 * [cost, percentageLoss, exponentialGroup]
 * ex: $100.00 (10000) with 20% (0.2) loss after 100 (100) items
 * 
 * - Omitting percentageLoss and exponentialGroup removes any diminishing returns from selling the item
 * @typedef {Object<string, number[1] | number[3]} SELLABLE_ITEMS
 */
const SELLABLE_ITEMS = {
	// blocks
	"minecraft:netherrack": [Money.FromDollar(0.01)],
	"minecraft:cobbled_deepslate": [Money.FromDollar(0.01)],
	"minecraft:deepslate": [Money.FromDollar(0.01)],

	// gems
	"minecraft:diamond": [Money.FromDollar(100.00), 0.5, 300],
	"minecraft:quartz": [Money.FromDollar(0.25), 0.2, 400],

	// misc minerals
	"minecraft:redstone": [Money.FromDollar(0.10), 0.5, 2000],
	"minecraft:coal": [Money.FromDollar(1.00), 0.5, 500],

	// ingots
	"minecraft:iron_ingot": [Money.FromDollar(10.00), 0.5, 500],
	"minecraft:gold_ingot": [Money.FromDollar(10.00)],
	"minecraft:copper_ingot": [Money.FromDollar(0.50), 0.2, 400],
	"minecraft:netherite_ingot": [Money.FromDollar(1000.00), 0.5, 100],

	// farming
	"minecraft:carrot": [Money.FromDollar(0.20), 0.5, 5000],
	"minecraft:baked_potato": [Money.FromDollar(0.50), 0.5, 10000],
	"minecraft:wheat": [Money.FromDollar(0.75), 0.5, 2500],
	"minecraft:honey_bottle": [Money.FromDollar(150.0), 0.5, 50],
	"minecraft:honeycomb": [Money.FromDollar(50.0), 0.5, 100],
	"minecraft:melon": [Money.FromDollar(0.10), 0.5, 2500],
	"minecraft:pumpkin": [Money.FromDollar(1.00), 0.5, 1000],
	"minecraft:cactus": [Money.FromDollar(1.00), 0.5, 5000],
	"minecraft:nether_wart": [Money.FromDollar(1.00), 0.5, 500],

	// farming (processed)
	"minecraft:sugar": [Money.FromDollar(1.00), 0.5, 2500],
	"minecraft:green_dye": [Money.FromDollar(2.50), 0.5, 1000],

	// mob drops
	"minecraft:tropical_fish": [Money.FromDollar(5.00), 0.5, 100],
	"minecraft:slime_ball": [Money.FromDollar(1.00)],
	"minecraft:nether_star": [Money.FromDollar(2500.00)],
	"minecraft:blaze_powder": [Money.FromDollar(5.00, 0.5, 250)],
	"minecraft:ghast_tear": [Money.FromDollar(50.00, 0.5, 64)],
	"minecraft:phantom_membrane": [Money.FromDollar(20.00, 0.5, 128)],
	"minecraft:bone_meal": [Money.FromDollar(0.50, 0.5, 512)],
	"minecraft:rotten_flesh": [Money.FromDollar(0.50, 0.5, 512)],
	"minecraft:string": [Money.FromDollar(1.00, 0.5, 512)],
	"minecraft:spider_eye": [Money.FromDollar(5.00, 0.5, 512)],
	"minecraft:feather": [Money.FromDollar(2.50, 0.5, 512)],
}