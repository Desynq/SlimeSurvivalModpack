// priority: 1000

interface IBaseAbilityUI {
	abilityEnabled(player: ServerPlayer_): void;
	alertCooldownOver(player: ServerPlayer_): void;
	displayCooldown(player: ServerPlayer_): void;
	displayCooldownWarning(player: ServerPlayer_): void;
}

abstract class BaseAbility {
	protected abstract readonly cooldownController: TimestampController;
	protected abstract readonly ui: IBaseAbilityUI;

	// Hooks for subclasses
	protected onActivate(player: ServerPlayer_): void {
		this.cooldownController.reset(player);
		this.ui.abilityEnabled(player);
	}

	public onPress(player: ServerPlayer_): boolean {
		if (!this.cooldownController.hasPassed(player)) {
			this.ui.displayCooldownWarning(player);
			return false;
		}
		return true;
	}

	public onTick(player: ServerPlayer_): boolean {
		if (!this.cooldownController.hasPassed(player)) {
			this.ui.displayCooldown(player);
		}
		else if (this.cooldownController.hasJustPassed(player)) {
			this.ui.alertCooldownOver(player);
		}
		return true;
	}
}
