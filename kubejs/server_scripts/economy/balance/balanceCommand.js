ServerEvents.commandRegistry(event => {
	const { commands: Commands, arguments: Arguments } = event;

	const cachedPlayerArgument = $Commands.argument("target", $StringArgumentType.string())
		.suggests((context, builder) => CustomArguments.suggestCachedPlayer(context, builder));

	const node = event.register(Commands.literal("balance")
		.executes(context => {
			tellSelfBalance(context.source.player);
			return 1;
		})
		// @ts-ignore
		.then(cachedPlayerArgument
			.requires(executor => executor.hasPermission(2))
			.executes(context => {
				const username = Arguments.STRING.getResult(context, "target");
				tellOfflineBalance(context.source.player, username);
				return 1;
			})
		)
	);

	event.register(Commands.literal("bal").redirect(node));


	/**
	 * 
	 * @param {ServerPlayer} executor 
	 */
	function tellSelfBalance(executor) {
		const rawBalance = PlayerMoney.get(executor.server, executor.uuid.toString());
		// @ts-ignore
		executor.tell(Text.gray(`You have $${MoneyManager.toDollarString(rawBalance)}.`));
	}

	function tellOfflineBalance(executor, username) {
		const uuid = PlayerUUIDUsernameBiMap.getUUID(executor.server, username);
		if (uuid == null) {
			executor.tell(Text.red(`${username} has not logged onto the server and therefore has no balance.`));
			return;
		}

		const rawBalance = PlayerMoney.get(executor.server, uuid.toString());
		executor.tell(Text.gray(`${username} has $${MoneyManager.toDollarString(rawBalance)}.`));
	}
});