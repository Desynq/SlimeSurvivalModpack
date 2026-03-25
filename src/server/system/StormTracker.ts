// priority: 900

namespace StormTracker {
	const stormTs = new ServerTimestamp("last_thunderstorm_start");

	let wasThundering: boolean | null = null;

	ServerEvents.tick(event => {
		const server = event.server;
		const thundering = isThundering(server);

		if (wasThundering === null) {
			wasThundering = thundering;

			if (thundering && !stormTs.has(server)) {
				stormTs.update(server);
			}
			return;
		}

		if (!wasThundering && thundering) {
			stormTs.update(server);
		}

		wasThundering = thundering;
	});

	function isThundering(server: MinecraftServer_): boolean {
		return server.overworld().thundering;
	}

	/**
	 * 
	 * @param server 
	 * @param time must be the timestamp of when a thunderstorm started
	 * @returns 
	 */
	export function isSameThunderstorm(server: MinecraftServer_, time: long): boolean {
		// no thunderstorm has occurred yet
		if (!stormTs.has(server)) return false;

		return stormTs.get(server) === time;
	}

	export function getCurrentStormStartTime(server: MinecraftServer_): long | null {
		return stormTs.has(server)
			? stormTs.get(server)
			: null;
	}
}