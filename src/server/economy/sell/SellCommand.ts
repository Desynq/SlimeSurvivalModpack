
ServerEvents.commandRegistry(event => {
	const { commands: Commands, arguments: Arguments } = event;

	const itemArgument = () => Commands.argument("item", Arguments.STRING.create(event) as any)
		.suggests((context, builder) => suggestSellableItem(builder));

	const amountArgument = () => Commands.argument("amount", $IntegerArgumentType.integer(1) as any)
		.suggests((context, builder) => suggestAmount(builder));

	event.register(Commands.literal("sell") // @ts-ignore
		.then(Commands.literal("item") // @ts-ignore
			.then(itemArgument() // @ts-ignore
				.then(amountArgument()
					.executes(context => {
						const itemName = Arguments.STRING.getResult(context, "item");
						const marketableItem = MarketableItem.fromName(itemName);

						const amount = Arguments.INTEGER.getResult(context, "amount");

						trySellTransaction(context.getSource().getPlayer(), marketableItem, amount);
						return 1;
					})
				) // @ts-ignore
				.then(Commands.literal("all")
					.executes(context => {
						const itemName = Arguments.STRING.getResult(context, "item");
						const marketableItem = MarketableItem.fromName(itemName);
						trySellTransaction(context.getSource().getPlayer(), marketableItem, undefined);
						return 1;
					})
				)
				.executes(context => {
					const itemName = Arguments.STRING.getResult(context, "item");
					const marketableItem = MarketableItem.fromName(itemName);
					trySellTransaction(context.getSource().getPlayer(), marketableItem, undefined);
					return 1;
				})
			)
		) // @ts-ignore
		.then(Commands.literal("hand")
			.executes(context => {
				const player = context.source.getPlayer();
				const itemId = player.inventory.getSelected().getItem().getId();
				const marketableItem = MarketableItem.fromId(itemId);

				trySellTransaction(player, marketableItem, 0);
				return 1;
			}) // @ts-ignore
			.then(Commands.literal("all")
				.executes(context => {
					const player = context.source.getPlayer();
					const itemId = player.inventory.getSelected().getItem().getId();
					const marketableItem = MarketableItem.fromId(itemId);

					trySellTransaction(player, marketableItem, undefined);
					return 1;
				})
			)
		) // @ts-ignore
		.then(Commands.literal("xp") // @ts-ignore
			.then(amountArgument()
				.executes(context => {
					const player = context.source.getPlayer();
					const amount = Arguments.INTEGER.getResult(context, "amount");

					trySellXpTransaction(player, amount);
					return 1;
				})
			)
		)
	);



	function suggestSellableItem(builder: SuggestionsBuilder_) {
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

	function trySellTransaction(player: ServerPlayer_, marketableItem: MarketableItem | undefined, sellAmount: number | undefined): void {
		try {
			let receipt = new SellTransaction(player, marketableItem, sellAmount).getReceipt();
			SellUI.outputReceipt(player, receipt);
		}
		catch (error) {
			SellUI.outputError(player, error);
		}
	}

	function trySellXpTransaction(player: ServerPlayer_, amount: integer): void {
		try {
			let receipt = new SellXpTransaction(player, amount).getReceipt();
			SellUI.outputXpReceipt(player, receipt);
		}
		catch (error) {
			SellUI.outputError(player, error);
		}
	}
});
