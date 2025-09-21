//priority: 100
new MarketableItem("iron_ingot", "minecraft:iron_ingot")
	.setSellPrice(5.00)
	.setCompoundingRate(0.5)
	.setCompoundingPeriod(500)
	.register();

new MarketableItem("gold_ingot", "minecraft:gold_ingot")
	.setSellPrice(10.00)
	.register();

new MarketableItem("copper_ingot", "minecraft:copper_ingot")
	.setSellPrice(2.50)
	.setCompoundingRate(0.2)
	.setCompoundingPeriod(400)
	.register();

new MarketableItem("netherite_ingot", "minecraft:netherite_ingot")
	.setSellPrice(150.00)
	.setCompoundingRate(0.5)
	.setCompoundingPeriod(100)
	.register();
