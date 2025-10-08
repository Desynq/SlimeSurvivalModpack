

const RX25Virus = new (class {
	private readonly INFECTION_TIME_ID = "disease.rx25.infection_timestamp";
	private readonly DAY_LENGTH = 24000;

	public tick(player: ServerPlayer_): void {
		const hasDisease = this.hasDisease(player);
		if (!TickHelper.hasTimestamp(player, this.INFECTION_TIME_ID)) {
			if (hasDisease) this.updateInfectionTime(player);
			return;
		}
		else {
			if (!hasDisease) this.removeInfectionTime(player);
		}

		const days = this.getInfectionDays(player)!;
	}

	public hasDisease(player: ServerPlayer_) {
		return player.tags.contains("disease.rx25");
	}

	public getInfectionTime(player: ServerPlayer_): long | undefined {
		return TickHelper.hasTimestamp(player, this.INFECTION_TIME_ID)
			? TickHelper.getTimestampDiff(player, this.INFECTION_TIME_ID)
			: undefined;
	}

	public updateInfectionTime(player: ServerPlayer_): void {
		TickHelper.forceUpdateTimestamp(player, this.INFECTION_TIME_ID);
	}

	public setInfectionDays(player: ServerPlayer_, days: integer): void {
		TickHelper.setTimestampBefore(player, this.INFECTION_TIME_ID, days * this.DAY_LENGTH);
	}

	public removeInfectionTime(player: ServerPlayer_): void {
		TickHelper.removeTimestamp(player, this.INFECTION_TIME_ID);
	}

	public getInfectionDays(player: ServerPlayer_): integer | undefined {
		const infectionTime = this.getInfectionTime(player);
		if (infectionTime === undefined) return undefined;

		return Math.floor(infectionTime / this.DAY_LENGTH);
	}

})();

PlayerEvents.tick(event => {
	RX25Virus.tick(event.player as any);
});