

namespace MobSpawnOverrides {

	CustomSpawnRegistry.INSTANCE
		.setOverride("minecraft:slime", new FixedSpawnTable.Builder()
			.addTable(new FixedSpawnTable.Builder()
				.addCancel(1.0)
				.build(),
				(event) => event.level.dimension.toString() === "slimesurvival:deadzone" ? 1 : 0
			)
			.addEntry("mowziesmobs:umvuthana_raptor", 0.05)
			.addEntry("mowziesmobs:lantern", 0.05)
			.addCappedEntry("cataclysm:cindaria", 0.05, 8)
			.build()
		)
		.setOverride("cataclysm:koboleton", new FixedSpawnTable.Builder()
			.addEntry("cataclysm:kobolediator", 0.005)
			.addCappedEntry("cataclysm:modern_remnant", 0.10, 4)
			.build()
		)
		.registerAll();
}