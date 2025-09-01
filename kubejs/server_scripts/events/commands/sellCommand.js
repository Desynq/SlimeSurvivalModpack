/**
 * @param {$CommandContext_<$CommandSourceStack_>} context
 * @param {$SuggestionsBuilder_} builder
 */
function suggestSellableItem(context, builder) {
	const items = Object.keys(SELLABLE_ITEMS);
	for (let item of items) {
		builder.suggest(`"${item}"`);
	}
	return builder.buildFuture();
}

/**
 * @param {$CommandContext_<$CommandSourceStack_>} context
 * @param {$SuggestionsBuilder_} builder
 */
function suggestAmount(context, builder) {
	const { source, source: { player } } = context;

	builder.suggest("1");
	builder.suggest("32");
	builder.suggest("64");
	return builder.buildFuture();
}

ServerEvents.commandRegistry(event => {
	const { commands: Commands, arguments: Arguments } = event;

	const itemArgument = Commands.argument("item", Arguments.STRING.create(event))
		.suggests((context, builder) => suggestSellableItem(context, builder));

	const amountArgument = Commands.argument("amount", Arguments.INTEGER.create(event))
		.suggests((context, builder) => suggestAmount(context, builder));

	event.register(Commands.literal("sell")
		.then(Commands.literal("item")
			.then(itemArgument
				.then(amountArgument
					.executes(context => {
						try {
							new SellTransaction(context, false);
						}
						catch (error) {
							tellIfOperator(context.source.player, Text.red(error));
						}
						return 1;
					})
				)
				.then(Commands.literal("all")
					.executes(context => {
						new SellTransaction(context, true);
						return 1;
					})
				)
			)
		)
	);
});