//priority: 100
new MarketableItem("redstone", "minecraft:redstone")
	.setSellPrice(0.10)
	.setCompoundingRate(0.5)
	.setCompoundingPeriod(2000)
	.register();

new MarketableItem("coal", "minecraft:coal")
	.setSellPrice(1.00)
	.setCompoundingRate(0.5)
	.setCompoundingPeriod(500)
	.register();