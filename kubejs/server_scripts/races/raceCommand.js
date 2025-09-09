
ServerEvents.commandRegistry(event => {
	const { commands: Commands, arguments: Arguments } = event;

	const raceArgument = Commands.argument("race", Arguments.STRING.create(event))
		.suggests((context, builder) => suggestRace(builder));

	const playerArgument = Commands.argument("player", Arguments.PLAYER.create(event));

	const nodes = {};
	nodes["/race"] = Commands.literal("race");

	nodes["/race choose"] = Commands.literal("choose")
		.then(raceArgument
			.executes(context => {
				let player = context.source.getPlayer();
				/** @type {string} */
				let raceId = Arguments.STRING.getResult(context, "race");
				PlayerRaceHelper.chooseRace(player, Races.fromId(raceId));
				return 1;
			})
		);

	nodes["/race set"] = Commands.literal("set")
		.requires(executor => executor.hasPermission(2))
		.then(playerArgument
			.then(raceArgument
				.executes(context => {
					let player = Arguments.PLAYER.getResult(context, "player");
					let raceId = Arguments.STRING.getResult(context, "race");
					PlayerRaceHelper.chooseRace(player, Races.fromId(raceId), true);
					return 1;
				})
			)
		)

	nodes["/race"]
		.then(nodes["/race choose"]);

	event.register(nodes["/race"]);

	/**
	 * 
	 * @param {import("com.mojang.brigadier.suggestion.SuggestionsBuilder").$SuggestionsBuilder$$Original} builder 
	 * @returns
	 */
	function suggestRace(builder) {
		for (let race of Races.getRaces()) {
			builder.suggest(race.getRaceId());
		}
		return builder.buildFuture();
	}
});