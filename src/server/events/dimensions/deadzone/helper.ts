// priority: 1

namespace DeadzoneHelper {
	const DIMENSION_ID = "slimesurvival:deadzone";

	export function isDeadzoneLevel(level: Level_): boolean {
		return level.dimension.toString() === DIMENSION_ID;
	}
}