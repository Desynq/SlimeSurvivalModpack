// priority: 1000

type KeyChangeListener = (player: ServerPlayer_, down: boolean) => void;

class KeybindManager {

	public static INSTANCE = new KeybindManager();

	private readonly playerKeyStates: Record<string, Record<string, boolean | undefined> | undefined> = {};

	private readonly keyChangeListeners: Record<string, KeyChangeListener[] | undefined> = {};

	private constructor() { }

	public setKeyState(player: ServerPlayer_, key: string, down: boolean) {
		const states = this.getKeyStates(player);
		const prevState = states[key];
		if (down === prevState) return;

		this.postKeyChange(player, key, down);
		states[key] = down;
	}

	public isKeyDown(player: ServerPlayer_, key: string): boolean {
		return this.getKeyStates(player)[key] ?? false;
	}

	public addListener(key: string, listener: KeyChangeListener): void {
		this.getKeyChangeListeners(key).push(listener);
	}



	private getKeyChangeListeners(key: string): KeyChangeListener[] {
		return this.keyChangeListeners[key] ??= [];
	}

	private getKeyStates(player: ServerPlayer_) {
		return this.playerKeyStates[player.stringUUID] ??= {};
	}

	private postKeyChange(player: ServerPlayer_, key: string, down: boolean): void {
		for (const listener of this.getKeyChangeListeners(key).slice()) {
			listener(player, down);
		}
	}
}