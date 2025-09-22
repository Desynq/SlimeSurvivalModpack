// priority: 1000

interface CooldownAbilityUI {
	abilityEnabled(player: ServerPlayer): void;
	abilityDisabled(player: ServerPlayer): void;
	alertCooldownOver(player: ServerPlayer): void;
	displayCooldown(player: ServerPlayer): void;
	updateUI(player: ServerPlayer): void;
	displayCooldownWarning(player: ServerPlayer): void;
}

interface IRaceAbility {
	onPress(player: ServerPlayer): void;
	onTick(player: ServerPlayer): void;
}

class AbilityInactiveError extends Error { }
class AbilityExpiredError extends Error { }
class AbilityDeathError extends Error { }

abstract class BaseAbility implements IRaceAbility {
	public constructor(
		protected toggleController: ToggleController,
		protected cooldownController: TimestampController,
		protected durationController: TimestampController,
		protected ui: CooldownAbilityUI
	) { }

	protected activateAbility(player: ServerPlayer) {
		this.cooldownController.reset(player);
		this.durationController.update(player);
		this.ui.abilityEnabled(player);
	}

	protected disableAbility(player: ServerPlayer): void {
		this.cooldownController.update(player);
		this.ui.abilityDisabled(player);
	}

	protected cancelAbility(player: ServerPlayer): void {
		this.disableAbility(player);
	}

	protected handleDeathWhileActive(player: ServerPlayer): void {
		this.toggleController.toggle(player);
		this.disableAbility(player);
	}

	protected handleAbilityExpiration(player: ServerPlayer): void {
		this.toggleController.toggle(player);
		this.disableAbility(player);
	}

	public onPress(player: ServerPlayer): void {
		if (!this.cooldownController.hasPassed(player)) {
			this.ui.displayCooldownWarning(player);
			return;
		}

		if (this.toggleController.toggle(player)) {
			this.activateAbility(player);
		}
		else {
			this.cancelAbility(player);
		}
	}

	protected validatePress(player: ServerPlayer): void {

	}

	public onTick(player: ServerPlayer): void {
		try {
			this.validateTick(player);
			this.tick(player);
		}
		catch (error) {
			this.handleTickValidationError(player, error);
		}
	}

	protected validateTick(player: ServerPlayer): void {
		if (!this.toggleController.isToggled(player)) {
			throw new AbilityInactiveError();
		}
		if (player.isDeadOrDying()) {
			throw new AbilityDeathError();
		}
		if (this.durationController.hasPassed(player)) {
			throw new AbilityExpiredError();
		}
	}

	protected handleTickValidationError(player: ServerPlayer, error: unknown): void {
		if (error instanceof AbilityInactiveError) {
			if (!this.cooldownController.hasPassed(player)) {
				this.ui.displayCooldown(player);
			}
			else if (this.cooldownController.hasJustPassed(player)) {
				this.ui.alertCooldownOver(player);
			}
		}
		else if (error instanceof AbilityDeathError) {
			this.handleDeathWhileActive(player);
		}
		else if (error instanceof AbilityExpiredError) {
			this.handleAbilityExpiration(player);
		}
	}

	protected tick(player: ServerPlayer): void {
		this.ui.updateUI(player);
	}
}