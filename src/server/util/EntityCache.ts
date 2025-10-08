// priority: 1000

class EntityCache<T extends Entity_> {
	private readonly _entities: Record<string, T> = Object.create(null);
	private _count: integer = 0;

	public constructor() { }

	public add(entity: T): void {
		if (this._entities[entity.stringUUID] !== undefined) return;

		this._entities[entity.stringUUID] = entity;
		this._count++;
	}

	public remove(entity: T): void {
		if (this._entities[entity.stringUUID] === undefined) return;

		delete this._entities[entity.stringUUID];
		this._count--;
	}

	public isCached(entity: unknown): boolean {
		return entity instanceof $Entity && this._entities[entity.stringUUID] !== undefined;
	}

	/**
	 * Removes any entities from the cache that don't succeed the predicate
	 */
	public verify(predicate: (entity: T) => boolean) {
		for (const entity of Object.values(this._entities)) {
			if (!predicate(entity)) {
				delete this._entities[entity.stringUUID];
				this._count--;
			}
		}
	}

	public get entities(): T[] {
		return Object.values(this._entities);
	}

	public get count(): integer {
		return this._count;
	}
}