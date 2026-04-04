// priority: 2


class ActionbarMessage {

	public text: string | undefined;
	public ticks: integer;
	public priority: integer;

	public id: string | symbol | null;

	/**
	 * @param id Optional identifier used to uniquely identify this message.
	 * - `undefined`: a `Symbol` will be generated automatically (default behavior)
	 * - `null`: disables identification (message is always treated as unique)
	 * - `string | symbol`: uses the provided identifier
	 */
	public constructor({ text, ticks = 1, priority = 0, id }: {
		text?: string,
		ticks?: integer,
		priority?: integer,
		id?: string | symbol | null;
	}) {
		this.text = text;
		this.ticks = ticks;
		this.priority = priority;
		switch (id) {
			case undefined:
				this.id = Symbol(text);
				break;
			case null:
				this.id = null;
				break;
			default:
				this.id = id;
		}
	}

	public show(player: ServerPlayer_, text?: string): void {
		ActionbarManager.addMsg({
			player,
			text: text ?? this.text ?? "undefined text",
			ticks: this.ticks,
			priority: this.priority,
			id: this.id ?? undefined
		});
	}
}