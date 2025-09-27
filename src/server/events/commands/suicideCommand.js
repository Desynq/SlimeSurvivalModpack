ServerEvents.commandRegistry(event => {
	const { commands: Commands, arguments: Arguments } = event;

	event.register(Commands.literal('die')
		.executes(c => kill(c.getSource().getPlayer()))
	);

	/**@param {ServerPlayer_} player */
	let kill = (player) => {
		player.getServer().runCommandSilent(`kill ${player.getUsername()}`)
		return 1;
	}
});