// priority: 1000

interface IBaseAbilityUI {
	abilityEnabled(player: ServerPlayer): void;
	alertCooldownOver(player: ServerPlayer): void;
	displayCooldown(player: ServerPlayer): void;
	displayCooldownWarning(player: ServerPlayer): void;
}

abstract class BaseAbility {
	protected abstract readonly cooldownController: TimestampController;
	protected abstract readonly ui: IBaseAbilityUI;

	// Hooks for subclasses
	protected onActivate(player: ServerPlayer): void {
		this.cooldownController.reset(player);
		this.ui.abilityEnabled(player);
	}

	public onPress(player: ServerPlayer): boolean {
		if (!this.cooldownController.hasPassed(player)) {
			this.ui.displayCooldownWarning(player);
			return false;
		}
		return true;
	}

	public onTick(player: ServerPlayer): boolean {
		if (!this.cooldownController.hasPassed(player)) {
			this.ui.displayCooldown(player);
		}
		else if (this.cooldownController.hasJustPassed(player)) {
			this.ui.alertCooldownOver(player);
		}
		return true;
	}
}
