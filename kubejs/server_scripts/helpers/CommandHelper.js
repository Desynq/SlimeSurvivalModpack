

const CommandHelper = (function() {
	/**
	 * 
	 * @param {MinecraftServer} server 
	 * @param {string} command 
	 * @param {boolean?} debug
	 */
	function runCommandSilent(server, command, debug) {
		if (debug) {
			tellOperators(server, command);
		}
		server.runCommandSilent(command);
	}

	return {
		runCommandSilent: runCommandSilent
	}
})();