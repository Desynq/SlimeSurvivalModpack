

namespace DeathFatigue.Events {

	PlayerEvents.tick(event => {
		const player = event.player as ServerPlayer_;
		// Manager.tick(player);
	});

	EntityEvents.death("minecraft:player" as any, event => {
		const player = event.entity as ServerPlayer_;
		// Manager.onDeath(player);
	});

	PlayerEvents.respawned(event => {
		const player = event.player as ServerPlayer_;
		// Manager.onRespawn(player);
	});
}