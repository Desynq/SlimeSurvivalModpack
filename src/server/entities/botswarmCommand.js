
ServerEvents.commandRegistry(event => {

	const node = $Commands.literal("botswarm")
		.requires(executor => executor.hasPermission(2))
		.executes(context => {
			const executor = context.source.player;
			spawnBotSwarm(executor);
			return 1;
		});

	event.register(node);

	/**
	 * 
	 * @param {Player_} executor 
	 */
	function spawnBotSwarm(executor) {
		BOT_USERNAMES.forEach(username => {
			CommandHelper.runCommandSilent(executor.server, `kill ${username}`);
			CommandHelper.runCommandSilent(executor.server, `execute at ${executor.username} run player ${username} spawn in survival`);
		});
	}
});