// priority: 1000

class AbilityToggle {
	protected readonly toggleController: ToggleController;

	public constructor(toggleController: ToggleController) {
		this.toggleController = toggleController;
	}

	protected toggleOn(player: ServerPlayer_) {
		this.toggleController.toggle(player);
	}

	protected toggleOff(player: ServerPlayer_) {
		this.toggleController.toggle(player);
	}

	public onPress(player: ServerPlayer_): void {
		if (!this.toggleController.isToggled(player)) {
			this.toggleOn(player);
		}
		else {
			this.toggleOff(player);
		}
	}

	public isToggleActive(player: ServerPlayer_): boolean {
		return this.toggleController.isToggled(player);
	}
}