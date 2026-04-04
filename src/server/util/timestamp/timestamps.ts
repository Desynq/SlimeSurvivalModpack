// priority: 999


class EntityTimestamp<T extends Entity_ = Entity_> extends Timestamp<T> {

	public constructor(
		id: string,
		defaultDuration: number = 1
	) {
		super({
			id,
			defaultDuration,
			getGameTime: (entity: T) => TickHelper.getGameTime(entity.server)
		});
	}
}

class ServerTimestamp<T extends MinecraftServer_ = MinecraftServer_> extends Timestamp<T> {

	public constructor(
		id: string,
		defaultDuration: number = 1
	) {
		super({
			id,
			defaultDuration,
			getGameTime: (server: T) => TickHelper.getGameTime(server)
		});
	}
}