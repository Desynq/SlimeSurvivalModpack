


class IdleWorldSystem {

	private readonly keys = [
		$GameRules.RULE_DAYLIGHT,
		$GameRules.RULE_WEATHER_CYCLE,
		$SereneSeasonsGameRules.RULE_DOSEASONCYCLE
	];

	public isPaused(server: MinecraftServer_): boolean {
		return server.persistentData.getBoolean('paused');
	}

	private setPaused(server: MinecraftServer_, paused: boolean): void {
		server.persistentData.putBoolean('paused', paused);
	}

	public evaluate(server: MinecraftServer_): void {
		const shouldPause = ServerHelper.shouldPauseWorld(server);

		if (shouldPause) {
			this.pause(server);
		}
		else {
			this.resume(server);
		}
	}


	public pause(server: MinecraftServer_): void {
		if (this.isPaused(server)) return;

		this.toggle(server, true);
	}

	public resume(server: MinecraftServer_): void {
		if (!this.isPaused(server)) return;

		this.toggle(server, false);
	}


	private toggle(server: MinecraftServer_, paused: boolean): void {
		for (const key of this.keys) {
			const rule = server.gameRules.getRule(key);
			rule.set(!paused, server);
			this.setPaused(server, paused);
		}
	}
}

const idleWorldSystem = new IdleWorldSystem();



PlayerEvents.loggedIn(e => {
	idleWorldSystem.evaluate(e.server);
});

PlayerEvents.loggedOut(e => {
	idleWorldSystem.evaluate(e.server);
});