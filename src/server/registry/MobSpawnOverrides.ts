

namespace MobSpawnOverrides {

	CustomSpawnRegistry.INSTANCE
		.setOverride("minecraft:slime", new FixedSpawnTable.Builder()
			.addEntry("mowziesmobs:umvuthana_raptor", 0.05)
			.addEntry("mowziesmobs:lantern", 0.05)
			.addCappedEntry("cataclysm:cindaria", 0.05, 8)
			.build()
		)
		.setOverride("cataclysm:koboleton", new FixedSpawnTable.Builder()
			.addEntry("cataclysm:kobolediator", 0.005)
			.addCappedEntry("cataclysm:modern_remnant", 0.25, 4)
			.build()
		)
		.registerAll();
}