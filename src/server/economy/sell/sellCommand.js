// @ts-nocheck
ServerEvents.commandRegistry(event => {
	const { commands: Commands, arguments: Arguments } = event;

	const itemArgument = Commands.argument("item", Arguments.STRING.create(event))
		.suggests((context, builder) => suggestSellableItem(builder));

	const amountArgument = Commands.argument("amount", $IntegerArgumentType.integer(1))
		.suggests((context, builder) => suggestAmount(builder));

	event.register(Commands.literal("sell")
		.then(Commands.literal("item")
			.then(itemArgument
				.then(amountArgument
					.executes(context => {
						const itemName = Arguments.STRING.getResult(context, "item");
						const marketableItem = MarketableItem.fromName(itemName);

						const amount = Arguments.INTEGER.getResult(context, "amount");

						trySellTransaction(context.getSource().getPlayer(), marketableItem, amount);
						return 1;
					})
				)
				.then(Commands.literal("all")
					.executes(context => {
						const itemName = Arguments.STRING.getResult(context, "item");
						const marketableItem = MarketableItem.fromName(itemName);
						trySellTransaction(context.getSource().getPlayer(), marketableItem, null);
						return 1;
					})
				)
				.executes(context => {
					const itemName = Arguments.STRING.getResult(context, "item");
					const marketableItem = MarketableItem.fromName(itemName);
					trySellTransaction(context.getSource().getPlayer(), marketableItem, null);
					return 1;
				})
			)
		)
		.then(Commands.literal("hand")
			.executes(context => {
				const player = context.source.getPlayer();
				const itemId = player.getInventory().getSelected().getItem().getId();
				const marketableItem = MarketableItem.fromId(itemId);

				trySellTransaction(context.getSource().getPlayer(), marketableItem, 0);
				return 1;
			})
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

	/**
	 * 
	 * @param {ServerPlayer} player 
	 * @param {MarketableItem} marketableItem 
	 * @param {number | null} sellAmount 
	 */
	function trySellTransaction(player, marketableItem, sellAmount) {
		try {
			let receipt = new SellTransaction(player, marketableItem, sellAmount).getReceipt();
			SellUI.outputReceipt(player, receipt);
		}
		catch (error) {
			SellUI.outputError(player, error);
		}
	}
});
