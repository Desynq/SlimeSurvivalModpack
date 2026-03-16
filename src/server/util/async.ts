// priority: 1000



function poll(server: MinecraftServer_, period: float, predicate: () => boolean): void {
	const uuid = $UUID.randomUUID();
	$TaskScheduler.repeatTask(server, period, () => {
		if (predicate()) {
			$TaskScheduler.unscheduleTask(uuid);
		}
	}, uuid);
}

function delay(server: MinecraftServer_, ticks: float, fun: () => void): UUID_ {
	const uuid = $UUID.randomUUID();
	$TaskScheduler.scheduleTask(server, ticks, fun, uuid);
	return uuid;
}