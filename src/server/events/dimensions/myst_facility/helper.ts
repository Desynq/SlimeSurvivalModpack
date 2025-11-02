// priority: 1

namespace MystHelper {
	const DIMENSION_ID = "slimesurvival:facility_1";

	export function isMystLevel(level: Level_): boolean {
		return level.dimension.toString() === DIMENSION_ID;
	}

	export function isInMystFacility(player: ServerPlayer_): boolean {
		const dimension = player.level.dimension.toString();
		return dimension === DIMENSION_ID;
	}

	export function getLevel(server: MinecraftServer_): ServerLevel_ {
		return server.getLevel(DIMENSION_ID) as ServerLevel_;
	}

	export function isMystPortalOpen(server: MinecraftServer_): boolean {
		return server.persistentData.getBoolean("overworld_myst_portal_open");
	}
}