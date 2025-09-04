ServerEvents.commandRegistry(event => {
	const { commands: Commands, arguments: Arguments } = event;

	const cachedPlayerArgument = $Commands.argument("target", $StringArgumentType.string())
		.suggests((context, builder) => CustomArguments.suggestCachedPlayer(context, builder));

	event.register(Commands.literal("balance")
		.executes(context => {
			tellSelfBalance(context.source.player);
			return 1;
		})
		.then(cachedPlayerArgument
			.requires(executor => executor.hasPermission(2))
			.executes(context => {
				const username = Arguments.STRING.getResult(context, "target");
				tellOfflineBalance(context.source.player, username);
				return 1;
			})
		)
	);


	/**
	 * 
	 * @param {$ServerPlayer_} executor 
	 */
	function tellSelfBalance(executor) {
		const rawBalance = PlayerMoney.get(executor.server, executor.uuid.toString());
		executor.tell(Text.gray(`You have $${MoneyManager.toDollarString(rawBalance)}.`));
	}

	function tellOfflineBalance(executor, username) {
		const uuid = PlayerUuidUsernameBiMap.getUuid(executor.server, username);
		if (uuid == null) {
			executor.tell(Text.red(`${username} has not logged onto the server and therefore has no balance.`));
			return;
		}

		const rawBalance = PlayerMoney.get(executor.server, uuid);
		executor.tell(Text.gray(`${username} has $${MoneyManager.toDollarString(rawBalance)}.`));
	}
});