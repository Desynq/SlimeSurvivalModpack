

namespace MobSpawnOverrides {

	CustomSpawnRegistry.INSTANCE
		.setOverride("minecraft:slime", new FixedSpawnTable.Builder()
			.addEntry("mowziesmobs:umvuthana_raptor", 0.01)
			.addEntry("mowziesmobs:lantern", 0.05)
			.addCappedEntry("cataclysm:cindaria", 0.05, 128, 16, "cindaria")
			.build()
		)
		.registerAll();
}