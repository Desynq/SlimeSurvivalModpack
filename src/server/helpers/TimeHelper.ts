// priority: 999

namespace TimeHelper {
	export function shiftTime(server: MinecraftServer_, targetTimeOfDay: integer): integer {
		const totalDayTime = server.overworld().getDayTime();
		const currentTimeOfDay = totalDayTime % TIME_IN_DAY;
		const newDayTime = totalDayTime + (targetTimeOfDay - currentTimeOfDay);

		server.overworld().setDayTime(newDayTime);
		return newDayTime;
	}

	export function getTimeOfDay(level: Level_): integer {
		const totalDayTime = level.getDayTime();
		const timeOfDay = totalDayTime % 24000;

		return timeOfDay;
	}

	export function getGlobalTimeOfDay(server: MinecraftServer_): integer {
		return getTimeOfDay(server.overworld() as ServerLevel_);
	}
}