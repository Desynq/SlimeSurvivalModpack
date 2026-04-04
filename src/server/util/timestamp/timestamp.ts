// priority: 1000

interface PersistentDataHolder {
	get persistentData(): CompoundTag_;
}

class Timestamp<T extends PersistentDataHolder> {
	public readonly id: string;
	public readonly defaultDuration: number;
	public readonly getGameTime: (holder: T) => number;

	public constructor(
		{ id, defaultDuration = 1, getGameTime }: {
			id: string,
			defaultDuration: number,
			getGameTime: (holder: T) => number;
		}
	) {
		this.id = id;
		this.defaultDuration = defaultDuration;
		this.getGameTime = getGameTime;
	}

	public resolve(holder: T): ResolvedTimestamp<T> {
		return new ResolvedTimestamp(this, holder);
	}

	/**
	 * @returns defaults to `0` if holder does not have timestamp
	 */
	public get(holder: T): long {
		return holder.persistentData.getLong(this.id);
	}

	public has(holder: T): boolean {
		return holder.persistentData.contains(this.id);
	}

	public getOrDefault<U>(holder: T, fallback: U): long | U {
		return this.has(holder)
			? this.get(holder)
			: fallback;
	}

	public update(holder: T, time?: long): void {
		const value = time ?? this.getGameTime(holder);
		holder.persistentData.putLong(this.id, value);
	}

	public remove(holder: T): void {
		holder.persistentData.remove(this.id);
	}

	public reset(holder: T): void {
		this.update(holder, $Long.MIN_VALUE);
	}

	public setBefore(holder: T, time: long): void {
		this.update(holder, this.getGameTime(holder) - time);
	}

	public setAfter(holder: T, time: long): void {
		this.update(holder, this.getGameTime(holder) + time);
	}



	/**
	 * @returns Time since timestamp was last set
	 */
	public getDiff(holder: T): long | undefined {
		if (this.has(holder)) {
			return this.getGameTime(holder) - this.get(holder);
		}
		else {
			return undefined;
		}
	}

	/**
	 * Will always return `true` if timestamp has not been set
	 */
	public hasElapsed(holder: T, duration?: long): boolean {
		duration ??= this.defaultDuration;
		const diff = this.getDiff(holder);
		return diff === undefined || diff >= duration;
	}

	public hasJustElapsed(holder: T, duration: long): boolean {
		return this.getDiff(holder) === duration;
	}

	public getElapsedTime(holder: T, duration: long): long | undefined {
		const diff = this.getDiff(holder);
		return diff === undefined
			? undefined
			: diff - duration;
	}

	public getRemaining(holder: T, duration: long): long | undefined {
		const diff = this.getDiff(holder);
		return diff === undefined
			? undefined
			: duration - diff;
	}

	/**
	 * Also returns `true` if timestamp has not been set
	 */
	public hasElapsedPast(holder: T, duration: long, timeAfter: long): boolean {
		const elapsed = this.getElapsedTime(holder, duration);
		return elapsed === undefined || elapsed >= timeAfter;
	}

	/**
	 * Tries to update the timestamp if it has elapsed.
	 * @returns `true` if timestamp has elapsed, `false` otherwise.
	 */
	public tryUpdate(holder: T, duration?: long): boolean {
		if (duration === undefined) duration = this.defaultDuration;
		if (this.hasElapsed(holder, duration)) {
			this.update(holder);
			return true;
		}
		return false;
	}

	/**
	 * Tries to update the timestamp if it has elapsed.
	 * @returns `true` if the timestamp hasn't elapsed, `false` otherwise.
	 */
	public tryReject(holder: T, duration?: long): boolean {
		return !this.tryUpdate(holder, duration);
	}
}