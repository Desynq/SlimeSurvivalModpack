
// this definitely isn't a security leak
ServerEvents.commandRegistry(event => {

	const evalCommand = $Commands.literal("eval")
		.requires(executor => executor.hasPermission(2))
		.then($Commands.argument("code", $Arguments.STRING.create(event))
			.executes(context => evaluateCommand(context.source, $Arguments.STRING.getResult(context, "code")))
		);

	event.register(evalCommand);

	/**
	 * 
	 * @param {CommandSourceStack} source 
	 * @param {string} code
	 */
	function evaluateCommand(source, code) {
		try {
			console.log(code);
			eval(`(server) => {${code}}`)(source.server);
		}
		catch (error) {
			source.getPlayer().tell(error.message + error.stack);
		}
		return 1;
	}
});