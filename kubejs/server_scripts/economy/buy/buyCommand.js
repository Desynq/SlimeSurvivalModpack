let $IntegerArgumentType = Java.loadClass("com.mojang.brigadier.arguments.IntegerArgumentType");

ServerEvents.commandRegistry(event => {
	const { commands: Commands, arguments: Arguments } = event;

	const itemArgument = Commands.argument("item", Arguments.STRING.create(event))
		.suggests((context, builder) => suggestSellableItem(builder));

	const amountArgument = Commands.argument("amount", $IntegerArgumentType.integer(1))
		.suggests((context, builder) => suggestAmount(builder));

	event.register(Commands.literal("buy")
		.then(Commands.literal("item")
			.then(itemArgument
				.then(amountArgument
					.executes(context => {
						const itemName = Arguments.STRING.getResult(context, "item");
						const mItem = MarketableItem.fromName(itemName);

						const amount = Arguments.INTEGER.getResult(context, "amount");

						new BuyTransaction(context.source.getPlayer(), mItem, amount);
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
		const sellableItems = MarketableItem.getBuyableItems();
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