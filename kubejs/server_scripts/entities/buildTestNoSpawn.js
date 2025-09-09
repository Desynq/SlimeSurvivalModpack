EntityEvents.checkSpawn("", event => {
	if (event.level.dimension.toString() !== "slimesurvival:buildtest") return;
	if (event.type !== "NATURAL") return;
	event.cancel();
});