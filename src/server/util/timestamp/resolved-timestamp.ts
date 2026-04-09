// priority: 999



class ResolvedTimestamp<T extends PersistentDataHolder> {

	public constructor(
		private readonly timestamp: Timestamp<T>,
		private readonly holder: T
	) { }

	private get id(): string {
		return this.timestamp.id;
	}

	private get defaultDuration(): number {
		return this.timestamp.defaultDuration;
	}

	private get gameTime(): number {
		return this.timestamp.getGameTime(this.holder);
	}

	public get time(): long {
		return this.holder.persistentData.getLong(this.id);
	}

	public get exists(): boolean {
		return this.holder.persistentData.contains(this.id);
	}

	public getOrDefault<U>(fallback: U): long | U {
		return this.exists ? this.time : fallback;
	}

	public update(time?: long): void {
		const value = time ?? this.gameTime;
		this.holder.persistentData.putLong(this.id, value);
	}

	public remove(): void {
		this.holder.persistentData.remove(this.timestamp.id);
	}

	public reset(): void {
		this.update($Long.MIN_VALUE);
	}

	public setBefore(time: long): void {
		this.update(this.timestamp.getGameTime(this.holder) - time);
	}

	public setAfter(time: long): void {
		this.update(this.gameTime + time);
	}



	/**
	 * @calculated
	 */
	public get delta(): long | undefined {
		if (this.exists) {
			return this.gameTime - this.time;
		}
		else {
			return undefined;
		}
	}

	/**
	 * Whether delta time is at or over the default duration of the timestamp
	 */
	public get elapsed(): boolean {
		const delta = this.delta;
		return delta === undefined || delta >= this.defaultDuration;
	}

	/**
	 * Sets the timestamp to be elapsed if it is not already elapsed
	 * 
	 * Works by setting the timestamp to a point where it would be elapsed (sets it back in time)
	 * @returns `true` if the timestamp was successfully elapsed
	 */
	public elapse(duration?: long): boolean {
		duration ??= this.defaultDuration;
		if (this.hasElapsed(duration)) {
			return false;
		}

		this.setBefore(duration);
		return true;
	}

	public hasElapsed(duration?: long): boolean {
		duration ??= this.defaultDuration;
		const delta = this.delta;
		return delta === undefined || delta >= duration;
	}

	public hasJustElapsed(duration: long): boolean {
		return this.delta === duration;
	}

	public getElapsedTime(duration: long): long | undefined {
		return mapIfDefined(this.delta, delta => delta - duration);
	}

	public getRemaining(duration: long): long | undefined {
		return mapIfDefined(this.delta, delta => duration - delta);
	}

	public hasElapsedPast(duration: long, timeAfter: long): boolean {
		const elapsed = this.getElapsedTime(duration);
		return elapsed === undefined || elapsed >= timeAfter;
	}

	public tryUpdate(duration?: long): boolean {
		duration ??= this.defaultDuration;
		if (this.hasElapsed(duration)) {
			this.update();
			return true;
		}

		return false;
	}

	public tryReject(duration?: long): boolean {
		return !this.tryUpdate(duration);
	}
}