

namespace DeadzoneEvents {

	EntityEvents.checkSpawn(event => {
		if (!DeadzoneHelper.isDeadzoneLevel(event.level)) return;
		if (event.type.toString() !== "NATURAL") return;
		event.cancel();
	});
}