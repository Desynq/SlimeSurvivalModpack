
NetworkEvents.dataReceived("KeyPressed", event => {
	const player = event.player;
	const uuid = player.uuid.toString();
	const key = event.data.getString("key");

	if (key != "crawl") {
		return;
	}

	player.causeFoodExhaustion(4);
});

/** @type {Object.<string, integer>} */
const prevWalkCmMap = {};

PlayerEvents.tick(event => {
	const { player } = event;
	const uuid = player.uuid.toString();

	const currWalkCm = player.stats.get($Stats.WALK_ONE_CM);
	const prevWalkCm = prevWalkCmMap[uuid] ?? currWalkCm;
	prevWalkCmMap[uuid] = currWalkCm;

	const deltaWalkCm = currWalkCm - prevWalkCm;

	if (player.pose.equals($Pose.CRAWLING)) {
		player.causeFoodExhaustion(deltaWalkCm * 0.005);
	}
});