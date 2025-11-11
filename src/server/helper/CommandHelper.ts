

namespace CommandHelper {
	export function runCommandSilent(ctx: MinecraftServer_ | Level_, command: string, debug?: boolean) {
		if (debug) {
			const server = ctx instanceof $Level ? ctx.server : ctx;
			tellOperators(server, command);
		}
		ctx.runCommandSilent(command);
	}

	export function getNarrowedSuggestions(builder: SuggestionsBuilder_, array: string[]) {
		const remaining = builder.getRemaining().toLowerCase();
		array.forEach(name => {
			if (name.toLowerCase().startsWith(remaining)) {
				builder.suggest(name);
			}
		});
		return builder;
	}

	export function sandbox(context: CommandExecutionContext_, fn: Function) {
		try {
			fn();
		}
		catch (error) {
			if (error instanceof Error) {
				context.source.getPlayer().tell(`${error.message} ${error.stack}`);
			}
		}
	}
}