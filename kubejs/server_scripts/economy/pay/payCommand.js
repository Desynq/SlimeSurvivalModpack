ServerEvents.commandRegistry(event => {
	const { commands: Commands, arguments: Arguments } = event;

	const cachedPlayerArgument = $Commands.argument("target", $StringArgumentType.string())
		.suggests((context, builder) => CustomArguments.suggestCachedPlayer(context, builder));

	event.register(Commands.literal("pay")
		// @ts-ignore
		.then(cachedPlayerArgument
			// @ts-ignore
			.then(Commands.argument("amount", Arguments.STRING.create(event))
				.executes(context => {
					try {
						let username = Arguments.STRING.getResult(context, "target");
						let amountString = Arguments.STRING.getResult(context, "amount");
						new PayTransaction(context.source.getPlayer(), username, amountString);
					}
					catch (error) {
						context.source.getPlayer().tell(`${error.message} ${error.stack}`)
					}
					return 1;
				})
			)
		)
	);
});