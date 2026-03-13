// priority: 1000



function defer(server: MinecraftServer_, period: float, predicate: () => boolean): void {
	const uuid = $UUID.randomUUID();
	$TaskScheduler.repeatTask(server, period, () => {
		if (predicate()) {
			$TaskScheduler.unscheduleTask(uuid);
		}
	}, uuid);
}