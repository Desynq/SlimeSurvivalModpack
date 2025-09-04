const GForce = {};

/** @type {Object.<string, FixedDeque<double>>} */
GForce.lastYVelocity = {};

GForce.G_PER_TICK = 0.08;

GForce.G_ALERT = 5.0;
GForce.G_DANGER = 10.0;
GForce.NAUSEA_DURATION_TICKS = 100;
GForce.NAUSEA_AMPLIFIER = 0;




PlayerEvents.tick(event => {
	const player = event.player;
	const uuid = player.uuid.toString();

	const yv = player.deltaMovement.y();
	const yVDeque = GForce.lastYVelocity[uuid];
	if (yVDeque == null) {
		GForce.lastYVelocity[uuid] = new FixedDeque(20);
		return;
	}
	yVDeque.push(yv);
	const prevYVs = yVDeque.get();
	const avgYV = prevYVs.reduce((a, b) => a + b, 0) / prevYVs.length;

	const avgGForce = avgYV / GForce.G_PER_TICK;

	let maxDiff = 0;
	for (let i = 1; i < prevYVs.length; i++) {
		let diff = Math.abs(prevYVs[i] / GForce.G_PER_TICK - avgGForce);
		if (diff > maxDiff) {
			maxDiff = diff;
		}
	}
	const jerkGForce = maxDiff;

	if (Math.abs(avgGForce) >= GForce.G_ALERT) {
		ActionbarManager.addText(uuid, `{"color":"red","text":"gForce: ${avgGForce.toFixed(2)}"}`);
		ActionbarManager.addText(uuid, `{"color":"red","text":"JerkGForce: ${jerkGForce.toFixed(2)}"}`);
	}
});