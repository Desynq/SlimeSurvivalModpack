// priority: 1000

class AbilityToggle {
	protected readonly toggleController: ToggleController;

	public constructor(toggleController: ToggleController) {
		this.toggleController = toggleController;
	}

	protected toggleOn(player: ServerPlayer) {
		this.toggleController.toggle(player);
	}

	protected toggleOff(player: ServerPlayer) {
		this.toggleController.toggle(player);
	}

	public onPress(player: ServerPlayer): void {
		if (!this.toggleController.isToggled(player)) {
			this.toggleOn(player);
		}
		else {
			this.toggleOff(player);
		}
	}

	public isToggleActive(player: ServerPlayer): boolean {
		return this.toggleController.isToggled(player);
	}
}