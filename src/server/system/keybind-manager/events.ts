

namespace KeysChanged {

	NetworkEvents.dataReceived("keys_changed", event => {
		const data = event.data;
		const player = event.player as ServerPlayer_;

		const json = data.getString("keys_changed");

		let changes: { key: string, down: boolean; }[];
		try {
			changes = JSON.parse(json);
		}
		catch (err) {
			console.warn(`Invalid key JSON from ${player.username}: ${err}`);
			return;
		}

		for (const entry of changes) {
			const key = entry.key as string;
			const down = entry.down as boolean;

			KeybindManager.INSTANCE.setKeyState(player, key, down);
		}

		// const message = changes.map(entry => `${entry.key}: ${entry.down}`).join("\n");
		// console.log(message);
	});
}