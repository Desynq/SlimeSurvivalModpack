
ServerEvents.commandRegistry(event => {
	const { commands: Commands, arguments: Arguments } = event;

	const itemArgument = Commands.argument("item", Arguments.STRING.create(event))
		.suggests((context, builder) => suggestSellableItem(builder));

	const amountArgument = Commands.argument("amount", Arguments.INTEGER.create(event))
		.suggests((context, builder) => suggestAmount(builder));

	event.register(Commands.literal("sell")
		.then(Commands.literal("item")
			.then(itemArgument
				.then(amountArgument
					.executes(context => {
						const itemName = Arguments.STRING.getResult(context, "item");
						const item = MarketableItem.fromName(itemName);

						try {
						new SellTransaction(context.source.player, item, null);
						}
						catch (error) {
							tellOperators(context.source.server, Text.darkRed(error));
						}
						return 1;
					})
				)
				.then(Commands.literal("all")
					.executes(context => {
						const itemName = Arguments.STRING.getResult(context, "item");
						const item = MarketableItem.fromName(itemName);

						const amount = Arguments.INTEGER.getResult(context, "amount");

						new SellTransaction(context.source.player, item, amount);
						return 1;
					})
				)
			)
		)
	);



	/**
	 * @param {$CommandContext_<$CommandSourceStack_>} context
	 * @param {$SuggestionsBuilder_} builder
	 */
	function suggestSellableItem(builder) {
		const sellableItems = MarketableItem.getSellableItems();
		for (let item of sellableItems) {
			builder.suggest(`${item.getName()}`);
		}
		return builder.buildFuture();
	}

	/**
	 * @param {$SuggestionsBuilder_} builder
	 */
	function suggestAmount(builder) {
		builder.suggest("1");
		builder.suggest("32");
		builder.suggest("64");
		return builder.buildFuture();
	}
});