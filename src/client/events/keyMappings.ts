

namespace KeyMappingsHandler {

	const lastStates: Record<string, boolean | undefined> = {};

	interface KeyPacket {
		key: string;
		down: boolean;
	}

	ClientEvents.tick(event => {
		const keyMappings = $Minecraft.instance.options.keyMappings;

		const changed: KeyPacket[] = [];

		for (const key of keyMappings) {
			const now = key.isDown();
			const name = key.name as string;
			const last = lastStates[name];

			if (now !== last) {
				lastStates[name] = now;
				changed.push({ key: name, down: now });
			}
		}

		if (changed.length > 0) {
			const payload = new $CompoundTag();
			payload.putString("keys_changed", JSON.stringify(changed));
			Client.player.sendData("keys_changed", payload);
		}
	});
}