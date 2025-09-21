

const CommandHelper = (function() {
	/**
	 * Runs a command silently on the server or server level
	 * @param {MinecraftServer | import("net.minecraft.world.level.Level").$Level$$Original} ctx 
	 * @param {string} command 
	 * @param {boolean} [debug]
	 */
	function runCommandSilent(ctx, command, debug) {
		if (debug) {
			const server = ctx instanceof $Level ? ctx.server : ctx;
			tellOperators(server, command);
		}
		ctx.runCommandSilent(command);
	}

	/**
	 * 
	 * @param {SuggestionsBuilder} builder 
	 * @param {string[]} array 
	 */
	function getNarrowedSuggestions(builder, array) {
		const remaining = builder.getRemaining().toLowerCase();
		array.forEach(name => {
			if (name.toLowerCase().startsWith(remaining)) {
				builder.suggest(name);
			}
		});
		return builder;
	}

	function sandbox(context, fn) {
		try {
			fn()
		}
		catch (error) {
			context.source.getPlayer().tell(`${error.message} ${error.stack}`);
		}
	}

	return {
		runCommandSilent: runCommandSilent,
		getNarrowedSuggestions: getNarrowedSuggestions,
		sandbox: sandbox
	}
})();