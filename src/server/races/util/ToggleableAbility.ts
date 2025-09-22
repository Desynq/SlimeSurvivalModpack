// priority: 1000

interface IToggleableAbilityUI {
	abilityEnabled(player: ServerPlayer): void;
	abilityDisabled(player: ServerPlayer): void;
	alertCooldownOver(player: ServerPlayer): void;
	displayCooldown(player: ServerPlayer): void;
	updateUI(player: ServerPlayer): void;
	displayCooldownWarning(player: ServerPlayer): void;
}

abstract class ToggleableAbility extends BaseAbility {
	protected abstract readonly toggleController: ToggleController;
	protected abstract readonly durationController: TimestampController;
	protected abstract readonly ui: IToggleableAbilityUI;

	// Hooks for subclasses
	protected onActivate(player: ServerPlayer): void {
		super.onActivate(player);
		this.durationController.update(player);
		this.toggleController.toggle(player);
	}
	protected onDeactivate(player: ServerPlayer): void {
		this.cooldownController.update(player);
		this.ui.abilityDisabled(player);
		this.toggleController.toggle(player);
	}

	/**
	 * Occurs when the player toggles on the ability and has no cooldown
	 */
	protected onInitiate(player: ServerPlayer) {
		this.onActivate(player);
	}
	/**
	 * Occurs when the player toggles off the ability and has no cooldown
	 */
	protected onCancel(player: ServerPlayer): void {
		this.onDeactivate(player);
	}
	/**
	 * Occurs when the player's ability duration runs out while the ability is active
	 */
	protected onExpire(player: ServerPlayer): void {
		this.onDeactivate(player);
	}
	/**
	 * Occurs when the player dies while the ability is active
	 */
	protected onDeath(player: ServerPlayer): void {
		this.onDeactivate(player);
	}

	public onPress(player: ServerPlayer): boolean {
		if (!super.onPress(player)) {
			return false;
		}

		if (!this.toggleController.isToggled(player)) {
			this.onInitiate(player);
		}
		else {
			this.onCancel(player);
		}
		return true;
	}

	public onTick(player: ServerPlayer): boolean {
		if (!this.toggleController.isToggled(player)) {
			if (!this.cooldownController.hasPassed(player)) {
				this.ui.displayCooldown(player);
			}
			else if (this.cooldownController.hasJustPassed(player)) {
				this.ui.alertCooldownOver(player);
			}
			return false;
		}

		if (player.isDeadOrDying()) {
			this.onDeath(player);
			return false;
		}

		if (this.durationController.hasPassed(player)) {
			this.onExpire(player);
			return false;
		}
		return true;
	}
}
