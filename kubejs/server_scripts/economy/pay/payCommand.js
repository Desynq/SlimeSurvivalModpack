ServerEvents.commandRegistry(event => {
	const { commands: Commands, arguments: Arguments } = event;

	const cachedPlayerArgument = $Commands.argument("target", $StringArgumentType.string())
		.suggests((context, builder) => CustomArguments.suggestCachedPlayer(context, builder));

	event.register(Commands.literal("pay")
		.then(cachedPlayerArgument
			.then(Commands.argument("amount", Arguments.STRING.create(event))
				.executes(context => {
					const username = Arguments.STRING.getResult(context, "target");
					const amountString = Arguments.STRING.getResult(context, "amount");

					new PayTransaction(context.source.getPlayer(), username, amountString);
					return 1;
				})
			)
		)
	);
});