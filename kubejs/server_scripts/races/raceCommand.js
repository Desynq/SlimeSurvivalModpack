
ServerEvents.commandRegistry(event => {
	const { commands: Commands, arguments: Arguments } = event;

	const raceArgument = Commands.argument("race", Arguments.STRING.create(event))
		.suggests((context, builder) => suggestRace(builder));

	const nodes = {};
	nodes["/race"] = Commands.literal("race");

	nodes["/race choose"] = Commands.literal("choose")
		.then(raceArgument
			.executes(context => {
				let player = context.source.getPlayer();
				/** @type {string} */
				let raceId = Arguments.STRING.getResult(context, "race");
				try {
					PlayerRaceHelper.chooseRace(player, Races.fromId(raceId));
				}
				catch (error) {
					console.log(`${error.message}\n${error.stack}`);
				}
				return 1;
			})
		);

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