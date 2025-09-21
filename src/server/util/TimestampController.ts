

abstract class TimestampController {
	protected abstract getKey(): string;

	public abstract getMax(player: ServerPlayer): number;

	public hasPassed(player: ServerPlayer): boolean {
		return TickHelper.hasTimestampPassed(player, this.getKey(), this.getMax(player));
	}

	public getCurr(player: ServerPlayer): number {
		return TickHelper.getTimestampDiff(player, this.getKey());
	}

	public update(player: ServerPlayer): void {
		TickHelper.forceUpdateTimestamp(player, this.getKey());
	}
}