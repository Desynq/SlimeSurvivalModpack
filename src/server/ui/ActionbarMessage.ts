// priority: 2


class ActionbarMessage {

	public text: string;
	public ticks: integer;
	public priority: integer;

	public id: string | symbol;

	public constructor({ text, ticks = 1, priority = 0, id }: {
		text: string,
		ticks?: integer,
		priority?: integer,
		id?: string | symbol;
	}) {
		this.text = text;
		this.ticks = ticks;
		this.priority = priority;
		this.id = id ?? Symbol(text);
	}

	public show(player: ServerPlayer_): void {
		ActionbarManager.addMsg({
			player,
			text: this.text,
			ticks: this.ticks,
			priority: this.priority,
			id: this.id
		});
	}
}