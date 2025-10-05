// priority: 999

namespace TimeHelper {
	export function shiftTime(server: MinecraftServer_, targetTimeOfDay: integer): integer {
		const totalDayTime = server.overworld().getDayTime();
		const currentTimeOfDay = totalDayTime % TIME_IN_DAY;
		const newDayTime = totalDayTime + (targetTimeOfDay - currentTimeOfDay);

		server.overworld().setDayTime(newDayTime);
		return newDayTime;
	}
}