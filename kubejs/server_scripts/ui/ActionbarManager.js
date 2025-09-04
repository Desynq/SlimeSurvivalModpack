PlayerEvents.tick(event => {
	const { player, server } = event;

	const uuid = player.uuid.toString();

	const texts = ActionbarManager.getTexts(uuid);

	if (texts.length == 0) {
		if (ActionbarManager.justReset[uuid]) {
			server.runCommandSilent(`title ${player.username} actionbar ""`);
			ActionbarManager.justReset[uuid] = false;
		}
		return;
	}

	let concatText = texts.join(",");

	if (concatText.length > 0) {
		server.runCommandSilent(`title ${player.username} actionbar [${concatText}]`);
	}

	ActionbarManager.resetTexts(uuid);
});




const ActionbarManager = {};

/** @type {Object.<string, string[]>} */
ActionbarManager.playerComponents = {};

/** @type {Object.<string, boolean>} */
ActionbarManager.justReset = {};


/**
 * @param {string} uuid 
 * @param {string} text must be a JSON component
 */
ActionbarManager.addText = function (uuid, text) {
	ObjectHelper.getOrCreateArray(ActionbarManager.playerComponents, uuid).push(text);
}

/**
 * @param {string} uuid 
 * @returns {string[]}
 */
ActionbarManager.getTexts = function (uuid) {
	return ObjectHelper.getOrCreateArray(ActionbarManager.playerComponents, uuid);
}

ActionbarManager.resetTexts = function (uuid) {
	ObjectHelper.getOrCreateArray(ActionbarManager.playerComponents, uuid).length = 0;
	ActionbarManager.justReset[uuid] = true;
}