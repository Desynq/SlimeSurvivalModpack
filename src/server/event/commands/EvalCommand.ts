
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



	function compileEval(code: string) {

		code = code.trim();

		try {
			return new Function(
				"server",
				"player",
				`return (${code});`
			);
		}
		catch { }

		const idx = code.lastIndexOf(";");

		if (idx !== -1) {

			const before =
				code.substring(0, idx);

			let after =
				code.substring(idx + 1).trim();

			if (!after) {
				return new Function(
					"server",
					"player",
					before
				);
			}

			if (after) {

				return new Function(
					"server",
					"player",
					`
				${before};
				return (${after});
				`
				);
			}
		}

		return new Function(
			"server",
			"player",
			code
		);
	}

	function evaluateCommand(source: CommandSourceStack_, code: string): integer {
		const player = source.getPlayer();
		try {
			console.log(code);

			const fn = compileEval(code);

			let result = fn(source.server, player);

			let message: string | undefined;
			if (Array.isArray(result)) {
				message = result.join("\n");
			}
			else if (StringHelper.needsStringify(result)) {
				try {
					message = JSON.stringify(result, null, 2);
				}
				catch (err) {
					const msg = err instanceof Error ? err.message : String(err);
					message = `[Unserializable Object: ${msg}]`;
				}
			}
			else if (result != undefined) {
				message = String(result);
			}

			if (message !== undefined) {
				player.tell(message);
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