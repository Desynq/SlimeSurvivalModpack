// priority: 900

namespace EntityEventsExt {

	const busses = {
		tick: new EventBus<TickEvent>()
	};

	export type TickEvent = ({ entity, server }: {
		entity: Entity_;
		server: MinecraftServer_;
	}) => void;

	export function tick(event: TickEvent): void {
		busses.tick.add(event);
	}

	ServerEvents.tick(event => {
		event.server.entities.forEach(entity => {
			busses.tick.emit({
				entity,
				server: event.server
			});
		});
	});
}