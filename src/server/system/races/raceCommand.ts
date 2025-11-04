namespace RaceCommand {

	ServerEvents.commandRegistry(event => {
		const { commands: Commands, arguments: Arguments } = event;

		const rootCmd = Commands.literal("race");

		const chooseCmd = Commands.literal("choose") // @ts-ignore
			.then(Commands.argument("race", Arguments.STRING.create(event))
				.suggests((context, builder) => suggestRace(builder))
				.executes(context => {
					try {
						const player = context.source.getPlayer();
						const race = Races.fromId(Arguments.STRING.getResult(context, "race"));
						if (race === undefined) return 1;

						const result = PlayerRaceHelper.chooseRace(player, race);
						tellRaceSwitchResult(player, result, race);
					}
					catch (error) {
						if (error instanceof Error) {
							console.log(error.message + "\n" + error.stack);
						}
					}
					return 1;
				})
			);

		const setCmd = Commands.literal("set")
			.requires(executor => executor.hasPermission(2)) // @ts-ignore
			.then(Commands.argument("player", Arguments.PLAYER.create(event)) // @ts-ignore
				.then(Commands.argument("race", Arguments.STRING.create(event))
					.suggests((context, builder) => suggestRace(builder))
					.executes(context => {
						const player = $Arguments.PLAYER.getResult(context, "player");
						const raceInput = $Arguments.STRING.getResult(context, "race");
						return setRace(player, raceInput, context);
					}) // @ts-ignore
					.then(Commands.argument("amount", Arguments.INTEGER.create(event))
						.executes(context => {
							const player = $Arguments.PLAYER.getResult(context, "player");
							const raceInput = $Arguments.STRING.getResult(context, "race");
							const setRaceResult = setRace(player, raceInput, context);
							if (setRaceResult === 0) return 0;

							const amount = $Arguments.INTEGER.getResult(context, "amount");
							return giveRacePoints(player, amount, context);
						})
					)
				)
			);

		const pointsCmd = Commands.literal("points")
			.requires(context => context.getPlayer().hasPermissions(2)) // @ts-ignore
			.then(Commands.literal("add") // @ts-ignore
				.then(Commands.argument("player", Arguments.PLAYER.create(event)) // @ts-ignore
					.then(Commands.argument("amount", Arguments.INTEGER.create(event))
						.executes(context => {
							const player = $Arguments.PLAYER.getResult(context, "player");
							const amount = $Arguments.INTEGER.getResult(context, "amount");
							return giveRacePoints(player, amount, context);
						})
					)
				)
			);

		rootCmd
			.then(chooseCmd as any)
			.then(setCmd as any)
			.then(pointsCmd as any);

		event.register(rootCmd);
	});


	function suggestRace(builder: SuggestionsBuilder_) {
		for (const race of Races.getRaces()) {
			builder.suggest(race.getRaceId());
		}
		return builder.buildFuture();
	}

	function setRace(player: ServerPlayer_, raceInput: string, context?: CommandExecutionContext_): integer {
		const race = Races.fromId(raceInput);
		if (race === undefined) return 0;

		const result = PlayerRaceHelper.chooseRace(player, race, true);
		tellRaceSwitchResult(player, result, race);

		return result.code === "SUCCESS" ? 1 : 0;
	}

	function giveRacePoints(player: ServerPlayer_, amount: integer, context?: CommandExecutionContext_): integer {
		PlayerRaceSkillHelper.addSkillPoint(player, amount);
		if (context) {
			const raceId = PlayerRaceHelper.getRace(player).getRaceId();
			context.source.sendSuccess(`Gave ${player.username} ${amount} ${raceId} skill points.`, true);
		}
		return 1;
	}

	function tellRaceSwitchResult(player: ServerPlayer_, result: RaceSwitchResult, race: Race) {
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
}