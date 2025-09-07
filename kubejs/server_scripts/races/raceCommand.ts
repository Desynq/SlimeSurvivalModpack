
ServerEvents.commandRegistry(event => {
	const { commands: Commands, arguments: Arguments } = event;

	event.register(Commands.literal("race") //@ts-ignore
		.then(Commands.literal("choose") //@ts-ignore
			.then(getRaceArgument() //@ts-ignore
				.executes(context => {
					
				})
			)
		)
	);







	function getRaceArgument() {
		return Commands.argument("race", Arguments.STRING.create(event) as any)
			.suggests((context: $CommandContext, builder: $SuggestionsBuilder) => suggestRace(builder));
	}

	function suggestRace(builder: import("com.mojang.brigadier.suggestion.SuggestionsBuilder").$SuggestionsBuilder$$Original) {
		for (let race of Races.getRaces()) {
			builder.suggest(race.getRaceId());
		}
		return builder.buildFuture();
	}
});