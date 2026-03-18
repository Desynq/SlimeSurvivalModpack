// priority: 2

class EntityManagerRegistry {
	private registry: Record<string, EntityManager<any>[]> = Object.create(null);

	public register(entity: Entity_, manager: EntityManager<any>): void {
		this.getManagers(entity).push(manager);
	}

	public unregister(entity: Entity_): void {
		delete this.registry[entity.stringUUID];
	}

	public getManagers(entity: Entity_): EntityManager<any>[] {
		return this.registry[entity.stringUUID] ??= [];
	}

	public isManaged(entity: Entity_): boolean {
		const managers = this.getManagers(entity);
		for (const manager of managers) {
			if (manager.isCachedEntity(entity)) return true;
		}

		return false;
	}
}