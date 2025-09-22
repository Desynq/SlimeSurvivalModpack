// priority: 1000

class TimestampController {

	public constructor(
		private readonly key: string,
		private readonly getMaxFn: (player: ServerPlayer) => integer
	) { }

	protected getKey(): string {
		return this.key;
	}

	public getMax(player: ServerPlayer): integer {
		return this.getMaxFn(player);
	}

	public hasPassed(player: ServerPlayer): boolean {
		return TickHelper.hasTimestampElapsed(player, this.getKey(), this.getMax(player));
	}

	public hasJustPassed(player: ServerPlayer): boolean {
		return TickHelper.hasTimestampJustElapsed(player, this.getKey(), this.getMax(player));
	}

	public getCurr(player: ServerPlayer): number {
		return TickHelper.getTimestampDiff(player, this.getKey());
	}

	public update(player: ServerPlayer): void {
		TickHelper.forceUpdateTimestamp(player, this.getKey());
	}

	public reset(player: ServerPlayer): void {
		TickHelper.resetTimestamp(player, this.getKey());
	}
}