// priority: 1000

class TimestampController {

	public constructor(
		private readonly key: string,
		private readonly getMaxFn: (player: ServerPlayer_) => integer
	) { }

	protected getKey(): string {
		return this.key;
	}

	public getMax(player: ServerPlayer_): integer {
		return this.getMaxFn(player);
	}

	public hasPassed(player: ServerPlayer_): boolean {
		return TickHelper.hasTimestampElapsed(player, this.getKey(), this.getMax(player));
	}

	public hasJustPassed(player: ServerPlayer_): boolean {
		return TickHelper.hasTimestampJustElapsed(player, this.getKey(), this.getMax(player));
	}

	public getCurr(player: ServerPlayer_): number {
		return TickHelper.getTimestampDiff(player, this.getKey());
	}

	public update(player: ServerPlayer_): void {
		TickHelper.forceUpdateTimestamp(player, this.getKey());
	}

	public reset(player: ServerPlayer_): void {
		TickHelper.resetTimestamp(player, this.getKey());
	}
}