// priority: 1000

class EntityTimestamp<T extends Entity_> {

	public constructor(
		private readonly id: string,
		private readonly defaultDuration: number = 1
	) { }

	public get(entity: T): long {
		return entity.persistentData.getLong(this.id);
	}

	public has(entity: T): boolean {
		return entity.persistentData.contains(this.id);
	}

	public update(entity: T, time?: long): void {
		const value = time ?? TickHelper.getGameTime(entity.server);
		entity.persistentData.putLong(this.id, value);
	}

	public remove(entity: T): void {
		entity.persistentData.remove(this.id);
	}

	public reset(entity: T): void {
		this.update(entity, $Long.MIN_VALUE);
	}

	public setBefore(entity: T, time: long): void {
		this.update(entity, TickHelper.getGameTime(entity.server) - time);
	}

	public setAfter(entity: T, time: long): void {
		this.update(entity, TickHelper.getGameTime(entity.server) + time);
	}



	/**
	 * @returns Time since timestamp was last set
	 */
	public getDiff(entity: T): long | undefined {
		if (this.has(entity)) {
			return TickHelper.getGameTime(entity.server) - this.get(entity);
		}
		else {
			return undefined;
		}
	}

	/**
	 * Will always return `true` if timestamp has not been set
	 */
	public hasElapsed(entity: T, duration: long): boolean {
		const diff = this.getDiff(entity);
		return diff === undefined || diff >= duration;
	}

	public hasJustElapsed(entity: T, duration: long): boolean {
		return this.getDiff(entity) === duration;
	}

	public getElapsedTime(entity: T, duration: long): long | undefined {
		const diff = this.getDiff(entity);
		return diff === undefined
			? undefined
			: diff - duration;
	}

	public getRemaining(entity: T, duration: long): long | undefined {
		const diff = this.getDiff(entity);
		return diff === undefined
			? undefined
			: duration - diff;
	}

	/**
	 * Also returns `true` if timestamp has not been set
	 */
	public hasElapsedPast(entity: T, duration: long, timeAfter: long): boolean {
		const elapsed = this.getElapsedTime(entity, duration);
		return elapsed === undefined || elapsed >= timeAfter;
	}

	/**
	 * Tries to update the timestamp if it has elapsed.
	 * @returns `true` if timestamp has elapsed, `false` otherwise.
	 */
	public tryUpdate(entity: T, duration?: long): boolean {
		if (duration === undefined) duration = this.defaultDuration;
		if (this.hasElapsed(entity, duration)) {
			this.update(entity);
			return true;
		}
		return false;
	}
}