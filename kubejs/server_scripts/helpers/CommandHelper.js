

const CommandHelper = (function() {
	/**
	 * 
	 * @param {MinecraftServer} server 
	 * @param {string} command 
	 * @param {boolean} [debug]
	 */
	function runCommandSilent(server, command, debug) {
		if (debug) {
			tellOperators(server, command);
		}
		server.runCommandSilent(command);
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

	return {
		runCommandSilent: runCommandSilent,
		getNarrowedSuggestions: getNarrowedSuggestions
	}
})();