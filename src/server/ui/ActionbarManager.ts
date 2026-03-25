// priority: 3

PlayerEvents.tick(event => {
	ActionbarManager.displayMessages(event.player as ServerPlayer_);
});


class ActionbarMessageInstance {

	public constructor(
		public readonly text: string,
		public readonly priority: integer,
		public ticks: number,
		public readonly id?: string | symbol,
	) { }

	public tick(): void {
		this.ticks--;
	}
}

class ActionbarManager {
	private static messages: Record<string, ActionbarMessageInstance[]> = {};

	private static getMessagesByUUID(uuid: string): ActionbarMessageInstance[] {
		return this.messages[uuid] ??= [];
	}

	private static getMessages(player: ServerPlayer_): ActionbarMessageInstance[] {
		return this.getMessagesByUUID(player.stringUUID);
	}

	private static dedupe(uuid: string, id?: string | symbol): void {
		if (id === undefined) return;

		ArrayHelper.forEachDeferredSplice(this.getMessagesByUUID(uuid), message => {
			if (message.id === id) return "splice";
		});
	}

	private static addMessageByUUID(uuid: string, text: string, ticks: integer = 1, priority: integer = 0, id?: string | symbol): void {
		this.dedupe(uuid, id);
		const messages = this.getMessagesByUUID(uuid);

		text = StringHelper.wrapIfNeeded(text);
		const message = new ActionbarMessageInstance(text, priority, ticks, id);

		let insertIndex = messages.findIndex(m => m.priority > priority);
		if (insertIndex === -1) {
			messages.push(message);
		}
		else {
			messages.splice(insertIndex, 0, message);
		}
	}

	public static addMessage(player: ServerPlayer_, text: string, ticks: integer = 1, priority: integer = 0, id?: string | symbol): void {
		this.addMessageByUUID(player.stringUUID, text, ticks, priority, id);
	}

	public static addMsg({ player, text, ticks = 1, priority = 0, id }: {
		player: ServerPlayer_,
		text: string,
		ticks?: integer,
		priority?: integer,
		id?: string | symbol;
	}): void {
		this.addMessageByUUID(player.stringUUID, text, ticks, priority, id);
	}

	private static containsByUUID(uuid: string, id: string | symbol): boolean {
		return this.getMessagesByUUID(uuid).some(message => message.id === id);
	}

	public static contains(player: ServerPlayer_, id: string | symbol): boolean {
		return this.containsByUUID(player.stringUUID, id);
	}

	private static tickMessages(player: ServerPlayer_): void {
		const messages = this.getMessages(player);

		ArrayHelper.forEachDeferredSplice(messages, message => {
			message.tick();
			if (message.ticks < 0) return "splice";
		});
	}

	public static displayMessages(player: ServerPlayer_): void {
		const messages = this.getMessages(player);
		if (messages.length === 0) return;

		const server = player.server;
		const username = player.username;
		this.tickMessages(player);
		if (messages.length === 0) { // clear actionbar if messages just cleared after ticking
			CommandHelper.runCommandSilent(server, `title ${username} actionbar ""`);
			return;
		}

		const concat = messages.map(m => m.text).join(`, "\\n",`);
		CommandHelper.runCommandSilent(server, `title ${username} actionbar ["", ${concat}]`);
	}



	// LEGACY SUPPORT

	/**
	 * Displays simple text on the actionbar for a set delay in ticks
	 * @param player
	 * @param text Stringified JSON component such as `{"text":"hello world"}`
	 * @param ticks Number of ticks to display for
	 */
	public static setSimple(player: ServerPlayer_, text: string, ticks: integer): void {
		this.addMessage(player, text, ticks);
	};


	/**
	 * @param arg0 string UUID or a player
	 * @param text must be a JSON component
	 */
	public static addText(arg0: string | ServerPlayer_, text: string): void {
		let uuid: string = arg0 instanceof $ServerPlayer
			? arg0.stringUUID
			: arg0;

		this.addMessageByUUID(uuid, text);
	};

	/**
	 * Adds quotes around the text so you don't have to.
	 */
	public static addSimple(player: ServerPlayer_, text: string): void {
		this.addMessage(player, `"${text}"`);
	};
}