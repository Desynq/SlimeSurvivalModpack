// priority: 2

class EntityManagerRegistry {
	private registry: Record<string, BossManager<any>> = Object.create(null);

	public register(entity: Entity_, manager: BossManager<any>): void {
		this.registry[entity.stringUUID] = manager;
	}

	public unregister(entity: Entity_): void {
		delete this.registry[entity.stringUUID];
	}

	public getManager(entity: Entity_): BossManager<any> | undefined {
		return this.registry[entity.stringUUID];
	}
}