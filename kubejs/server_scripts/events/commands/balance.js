ServerEvents.commandRegistry(event => {
	const { commands: Commands, arguments: Arguments } = event;

	event.register(Commands.literal("balance")
		.executes(context => {
			tellBalance(context.source.player);
			return 1;
		})
	);



	/**
	 * 
	 * @param {$ServerPlayer_} player 
	 */
	function tellBalance(player) {
		const rawBalance = PlayerMoney.get(player.server, player.uuid.toString());
		player.tell(Text.gray(`You have $${Money.ToDollarString(rawBalance)}`));
	}
});