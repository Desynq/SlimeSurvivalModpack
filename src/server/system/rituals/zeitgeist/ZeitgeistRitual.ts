
namespace ZeitgeistRitual {

	const lastStormStartTs = new ServerTimestamp("last_zeitgeist_storm");

	const notOverworldMsg = new ActionbarMessage({
		text: `{"color":"red","text":"Ritual can only be done in overworld."}`,
		ticks: 100
	});
	const inactiveConduitMsg = new ActionbarMessage({
		text: `{"color":"red","text":"Conduit must be active in order to summon Zeitgeist."}`,
		ticks: 100
	});
	const notStormingMsg = new ActionbarMessage({
		text: `{"color":"red","text":"It must be thundering in order to summon Zeitgeist."}`,
		ticks: 100
	});
	const sameStormMsg = new ActionbarMessage({
		text: `{"color":"red","text":"Cannot summon Zeitgeist within the same thunderstorm."}`,
		ticks: 100
	});

	// @ts-ignore
	BlockEvents.rightClicked("minecraft:conduit", event => {
		const server = event.server;
		const level = event.level;
		const player = event.player as ServerPlayer_;

		const item = player.mainHandItem;
		if (item.id.toString() !== "cataclysm:storm_eye") return;

		if (level.dimension.toString() !== "minecraft:overworld") {
			notOverworldMsg.show(player);
			return;
		}

		const pos = event.block.getPos();
		const conduit = event.block.getEntity() as ConduitBlockEntity_;
		if (!conduit.active) {
			inactiveConduitMsg.show(player);
			return;
		}

		const currentStormStart = StormTracker.getCurrentStormStartTime(server);

		if (!level.thundering || currentStormStart === null) {
			notStormingMsg.show(player);
			return;
		}

		const lastStorm = lastStormStartTs.getOrDefault(server, null);
		if (lastStorm !== null && lastStorm === currentStormStart) {
			sameStormMsg.show(player);
			return;
		}

		// start event

		lastStormStartTs.update(server, currentStormStart);
		const center = pos.center;
		level.destroyBlock(pos, true, player);
		item.count--;

		const below = pos.subtract([0, 1, 0]);
		Summonables.ZEITGEIST.spawn(level, below.bottomCenter);
	});
}