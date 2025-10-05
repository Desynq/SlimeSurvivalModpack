// priority: 1000

class EntityCache<T extends Entity_> {
	private readonly _entities: Record<string, T> = Object.create(null);
	private _count: integer = 0;

	public constructor() { }

	public add(entity: T): void {
		if (this.isCached(entity)) return;

		this._entities[entity.stringUUID] = entity;
		this._count++;
	}

	public remove(entity: T): void {
		if (!this.isCached(entity)) return;

		delete this._entities[entity.stringUUID];
		this._count--;
	}

	public isCached(entity: unknown): boolean {
		return entity instanceof $Entity && this._entities[entity.stringUUID] !== undefined;
	}

	public get entities(): T[] {
		return Object.values(this._entities);
	}

	public get count(): integer {
		return this._count;
	}
}