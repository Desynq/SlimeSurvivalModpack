
// this definitely isn't a security leak
ServerEvents.commandRegistry(event => {

	const evalCommand = $Commands.literal("eval")
		.requires(executor => executor.hasPermission(2)) // @ts-ignore
		.then($Commands.argument("code", $Arguments.GREEDY_STRING.create(event))
			.executes(context => {
				return evaluateCommand(context.source, $Arguments.GREEDY_STRING.getResult(context, "code"));
			})
		);

	event.register(evalCommand);



	function evaluateCommand(source: CommandSourceStack_, code: string): integer {
		const player = source.getPlayer();
		try {
			console.log(code);

			const wrappedCode = code.trim().startsWith("return") ? code : `return (${code})`;
			const fn: (server: MinecraftServer_, player: ServerPlayer_) => any =
				eval(`(server, player) => { ${wrappedCode} }`);

			let result = fn(source.server, player);

			if (result != undefined) {
				player.tell(String(result));
			}
		}
		catch (error) {
			if (error instanceof Error) {
				const message = error.message || "Unknown error";
				const stack = error.stack || "No stack trace available";

				const text = Text.of(StringHelper.sanitizeControlChars(message))
					.yellow()
					.hover(
						Text.of(StringHelper.sanitizeControlChars(stack))
					);

				player.tell(text);
			}
		}
		return 1;
	}
});