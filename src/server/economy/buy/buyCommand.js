/** @type {typeof import("com.mojang.brigadier.arguments.IntegerArgumentType").$IntegerArgumentType } */
let $IntegerArgumentType = Java.loadClass("com.mojang.brigadier.arguments.IntegerArgumentType")


ServerEvents.commandRegistry(event => {
	const { commands: Commands, arguments: Arguments } = event;

	const itemArgument = Commands.argument("item", Arguments.STRING.create(event))
		.suggests((context, builder) => suggestBuyableItem(context, builder));

	const amountArgument = Commands.argument("amount", $IntegerArgumentType.integer(1))
		.suggests((context, builder) => suggestAmount(builder));

	event.register(Commands.literal("buy")
		.then(Commands.literal("item")
			.then(itemArgument
				.then(amountArgument
					.executes(context => resolveBuyTransaction(context))
				)
				.executes(context => resolveBuyTransaction(context))
			)
		)
	);


	/**
	 * 
	 * @param {CommandExecutionContext} context 
	 */
	function resolveBuyTransaction(context) {
		const itemName = Arguments.STRING.getResult(context, "item");
		const mItem = MarketableItem.fromName(itemName);

		let amount = 1;
		try {
			amount = Arguments.INTEGER.getResult(context, "amount");
		}
		catch (error) { }

		new BuyTransaction(context.source.getPlayer(), mItem, amount);
		return amount;
	}

	/**
	 * @param {CommandExecutionContext} context
	 * @param {SuggestionsBuilder_} builder
	 */
	function suggestBuyableItem(context, builder) {
		const buyableItemNames = MarketableItem.getBuyableItems().map(item => item.getName());
		return CommandHelper.getNarrowedSuggestions(builder, buyableItemNames).buildFuture();
	}

	/**
	 * @param {SuggestionsBuilder_} builder
	 */
	function suggestAmount(builder) {
		builder.suggest("1");
		builder.suggest("32");
		builder.suggest("64");
		return builder.buildFuture();
	}
});