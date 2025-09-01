ServerEvents.commandRegistry(event => {
	const { commands: Commands, arguments: Arguments } = event;

	event.register(Commands.literal("balance")
		.executes(context => {
			tellBalance(context.source.player);
			return 1;
		})
		.then(Commands.argument("target", Arguments.PLAYER.create(event))
			.executes(context => {
				/** @type $ServerPlayer_ */
				const target = Arguments.PLAYER.getResult(context, "target");

				tellBalance(context.source.player, target);
				return 1;
			})
		)
	);



	/**
	 * 
	 * @param {$ServerPlayer_} executor
	 * @param {string|null|$ServerPlayer_} param2
	 */
	function tellBalance(executor, param2) {
		if (param2 == null) {
			param2 = executor.uuid.toString();
		}
		else if (param2 instanceof $ServerPlayer) {
			param2.uuid.toString();
		}

		const rawBalance = PlayerMoney.get(executor.server, param2);
		executor.tell(Text.gray(`You have $${Money.ToDollarString(rawBalance)}`));
	}
});