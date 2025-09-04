//priority: 100
new MarketableItem("diamond", "minecraft:diamond")
	.setSellPrice(100.00)
	.setBuyPrice(500.00)
	.setCompoundingRate(0.5)
	.setCompoundingPeriod(300)
	.register();

new MarketableItem("quartz", "minecraft:quartz")
	.setSellPrice(0.25)
	.setCompoundingRate(0.2)
	.setCompoundingPeriod(400)
	.register();