// priority: 900

type JavaClass<T> = {
	new(...args: any[]): T;
};

namespace EntityEventsExt {

	export type TickEvent<T extends Entity_ = Entity_> = ({ entity, server }: {
		entity: T;
		server: MinecraftServer_;
	}) => void;

	export type JoinEvent<T extends Entity_ = Entity_> = ({ entity }: {
		entity: T;
	}) => void;

	export type LeaveEvent<T extends Entity_ = Entity_> = ({ entity }: {
		entity: T;
	}) => void;

	const busses = {
		tick: new EventBus<TickEvent>(),
		join: new EventBus<JoinEvent>(),
		leave: new EventBus<LeaveEvent>(),
	};

	export function onTick(event: TickEvent): void {
		busses.tick.add(event);
	}

	export function onJoin(event: JoinEvent): void {
		busses.join.add(event);
	}

	export function onLeave(event: LeaveEvent): void {
		busses.leave.add(event);
	}



	const tickForBusses = new $LinkedHashMap<any, EventBus<any>>();

	export function onTickFor<T extends Entity_>(clazz: T, event: TickEvent<T>): void {
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
						server: event.server
					});
				}
			});
		});
	});
}