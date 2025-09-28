//priority: 100
new MarketableItem("diamond", "minecraft:diamond")
	.setSellPrice(75.00)
	.setBuyPrice(175.00)
	.setCompoundingRate(0.5)
	.setCompoundingPeriod(300)
	.register();

new MarketableItem("quartz", "minecraft:quartz")
	.setSellPrice(2.50)
	.setCompoundingRate(0.2)
	.setCompoundingPeriod(400)
	.register();

new MarketableItem("emerald", "minecraft:emerald")
	.setSellPrice(20.00)
	.setBuyPrice(100.00)
	.register();

new MarketableItem("lapis", "minecraft:lapis_lazuli")
	.setSellPrice(3.00)
	.setBuyPrice(10.00)
	.register();