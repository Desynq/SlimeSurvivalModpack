// @ts-nocheck
ServerEvents.commandRegistry(event => {
	const { commands: Commands, arguments: Arguments } = event;

	const nodes = {};
	nodes["/race"] = Commands.literal("race");

	nodes["/race choose"] = Commands.literal("choose")
		.then(Commands.argument("race", Arguments.STRING.create(event))
			.suggests((context, builder) => suggestRace(builder))
			.executes(context => {
				try {
					let player = context.source.getPlayer();
					/** @type {string} */
					let race = Races.fromId(Arguments.STRING.getResult(context, "race"));
					let result = PlayerRaceHelper.chooseRace(player, race);
					tellRaceSwitchResult(player, result, race);
				}
				catch (error) {
					console.log(error.message + "\n" + error.stack);
				}
				return 1;
			})
		);

	nodes["/race set"] = Commands.literal("set")
		.requires(executor => executor.hasPermission(2))
		.then(Commands.argument("player", Arguments.PLAYER.create(event))
			.then(Commands.argument("race", Arguments.STRING.create(event))
				.suggests((context, builder) => suggestRace(builder))
				.executes(context => {
					let player = Arguments.PLAYER.getResult(context, "player");
					let race = Races.fromId(Arguments.STRING.getResult(context, "race"));
					let result = PlayerRaceHelper.chooseRace(player, race, true);
					tellRaceSwitchResult(player, result, race);
					return 1;
				})
			)
		);

	nodes["/race points"] = Commands.literal("points")
		.requires(context => context.getPlayer().hasPermissions(2))
		.then(Commands.literal("add")
			.then(Commands.argument("player", Arguments.PLAYER.create(event))
				.then(Commands.argument("amount", Arguments.INTEGER.create(event))
					.executes(context => {
						let player: ServerPlayer_ = Arguments.PLAYER.getResult(context, "player");
						let amount = Arguments.INTEGER.getResult(context, "amount");
						PlayerRaceSkillHelper.addSkillPoint(player, amount);
						context.source.getPlayer().tell(`Gave ${player.username} ${amount} ${PlayerRaceHelper.getRace(player).getRaceId()} skill points.`);
						return 1;
					})
				)
			)
		);

	nodes["/race"]
		.then(nodes["/race choose"])
		.then(nodes["/race set"])
		.then(nodes["/race points"]);

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

	/**
	 * 
	 * @param {Player_} player 
	 * @param {RaceSwitchResult} result 
	 * @param {Race} race
	 */
	function tellRaceSwitchResult(player, result, race) {
		switch (result.code) {
			case "ALREADY_THIS_RACE":
				player.tell(Text.red("You are already this race."));
				break;
			case "CANNOT_SWITCH_RACE":
				player.tell(Text.red(`You cannot choose a different race unless your race is ${Races.defaultRace().getRaceId()}.`));
				break;
			case "SUCCESS":
				player.tell(Text.green(`Successfully chose ${race.getRaceId()} race.`));
				break;
		}
	}
});