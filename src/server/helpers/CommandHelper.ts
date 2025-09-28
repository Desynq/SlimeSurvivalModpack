

class CommandHelper {
	public static runCommandSilent(ctx: MinecraftServer_ | Level_, command: string, debug?: boolean) {
		if (debug) {
			const server = ctx instanceof $Level ? ctx.server : ctx;
			tellOperators(server, command);
		}
		ctx.runCommandSilent(command);
	}

	public static getNarrowedSuggestions(builder: SuggestionsBuilder_, array: string[]) {
		const remaining = builder.getRemaining().toLowerCase();
		array.forEach(name => {
			if (name.toLowerCase().startsWith(remaining)) {
				builder.suggest(name);
			}
		});
		return builder;
	}

	public static sandbox(context, fn) {
		try {
			fn();
		}
		catch (error) {
			context.source.getPlayer().tell(`${error.message} ${error.stack}`);
		}
	}
}