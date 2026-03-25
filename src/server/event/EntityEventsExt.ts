// priority: 900

type JavaClass<T> = {
	new(...args: any[]): T;
};

namespace EntityEventsExt {

	const busses = {
		tick: new EventBus<TickEvent<Entity_>>()
	};

	const tickForBusses = new $LinkedHashMap<any, EventBus<any>>();

	export type TickEvent<T extends Entity_> = ({ entity, server }: {
		entity: T;
		server: MinecraftServer_;
	}) => void;

	export function tick(event: TickEvent<Entity_>): void {
		busses.tick.add(event);
	}

	export function tickFor<T extends Entity_>(clazz: T, event: TickEvent<T>): void {
		let bus = tickForBusses.get(clazz);

		if (!bus) {
			bus = new EventBus<TickEvent<T>>();
			tickForBusses.put(clazz, bus);
		}

		bus.add(event);
	}

	ServerEvents.tick(event => {
		event.server.entities.forEach(entity => {
			busses.tick.emit({
				entity,
				server: event.server
			});

			tickForBusses.forEach((clazz, bus) => {
				if (entity instanceof clazz) {
					bus.emit({
						entity,
						serveer: event.server
					});
				}
			});
		});
	});
}