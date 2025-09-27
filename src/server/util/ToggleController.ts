// priority: 1000

class ToggleController {

	public constructor(
		private readonly key: string
	) { }

	public isToggled(player: ServerPlayer_): boolean {
		return player.persistentData.getBoolean(this.key);
	}

	/**
	 * @returns the new state of the toggle
	 */
	public toggle(player: ServerPlayer_): boolean {
		const newValue = !this.isToggled(player);
		player.persistentData.putBoolean(this.key, newValue);
		return newValue;
	}
}