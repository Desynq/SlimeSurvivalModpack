

PlayerEvents.tick(event => {
	const { player, server } = event;
	/** @type {string} */ // @ts-ignore
	const uuid = player.stringUUID;

	const texts = ActionbarManager.getTexts(uuid);
	if (texts.length > 0) {
		let concatText = texts.join(`," ",`);
		if (concatText.length > 0) {
			CommandHelper.runCommandSilent(server, `title ${player.username} actionbar ["",${concatText}]`);
		}
		ActionbarManager.resetTexts(uuid);
		// If non-delayed text is shown, just decrement delayed ticks if present
		const delayed = ActionbarManager.delayedMessages[uuid];
		if (delayed && delayed.ticks > 0) {
			delayed.ticks--;
			if (delayed.ticks === 0) {
				delete ActionbarManager.delayedMessages[uuid];
			}
		}
		return;
	}

	// Only show delayed text if no non-delayed texts
	const delayed = ActionbarManager.delayedMessages[uuid];
	if (delayed && delayed.ticks > 0) {
		CommandHelper.runCommandSilent(server, `title ${player.username} actionbar ["",${delayed.text}]`);
		delayed.ticks--;
		if (delayed.ticks === 0) {
			delete ActionbarManager.delayedMessages[uuid];
			server.runCommandSilent(`title ${player.username} actionbar ""`);
		}
		return;
	}

	if (ActionbarManager.justReset[uuid]) {
		server.runCommandSilent(`title ${player.username} actionbar ""`);
		ActionbarManager.justReset[uuid] = false;
	}
});




const ActionbarManager = {};

/** @type {Object.<string, string[]>} */
ActionbarManager.playerComponents = {};

/** @type {Object.<string, boolean>} */
ActionbarManager.justReset = {};

/** @type {Object.<string, {text: string, ticks: number}>} */
ActionbarManager.delayedMessages = {};

/**
 * Displays simple text on the actionbar for a set delay in ticks
 * @param {import("net.minecraft.server.level.ServerPlayer").$ServerPlayer$$Original} player
 * @param {string} text Stringified JSON component such as `{"text":"hello world"}`
 * @param {number} delay Number of ticks to display for
 */
ActionbarManager.setSimple = function(player, text, delay) {
	// @ts-ignore
	ActionbarManager.delayedMessages[player.stringUUID] = {
		text: text,
		ticks: delay
	};
};


/**
 * @param {string | Player_} arg0 string UUID or a player
 * @param {string} text must be a JSON component
 */
ActionbarManager.addText = function(arg0, text) {
	if (arg0 instanceof $Player) {
		arg0 = arg0.uuid.toString();
	}
	ObjectHelper.getOrCreateArray(ActionbarManager.playerComponents, arg0).push(text);
}

/**
 * Adds quotes around the text so you don't have to.
 * @param {import("net.minecraft.server.level.ServerPlayer").$ServerPlayer$$Original} player 
 * @param {string} text 
 */
ActionbarManager.addSimple = function(player, text) {
	ActionbarManager.addText(player.uuid.toString(), `"${text}"`);
}

/**
 * 
 * @param {MinecraftServer_} server 
 * @param {string} text 
 */
ActionbarManager.addDebug = function(server, text) {
	server.playerList.players.stream().filter(player => player.hasPermissions(2)).forEach(player => {
		ActionbarManager.addSimple(player, text);
	});
}

/**
 * @param {string} uuid 
 * @returns {string[]}
 */
ActionbarManager.getTexts = function(uuid) {
	return ObjectHelper.getOrCreateArray(ActionbarManager.playerComponents, uuid);
}

ActionbarManager.resetTexts = function(uuid) {
	ObjectHelper.getOrCreateArray(ActionbarManager.playerComponents, uuid).length = 0;
	ActionbarManager.justReset[uuid] = true;
}