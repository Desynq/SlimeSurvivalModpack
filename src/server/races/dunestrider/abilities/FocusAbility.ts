// priority: 1

const FocusAbility = new (class extends ToggleableAbility {

	protected readonly toggleController = new ToggleController("dunestrider.focus.toggle");

	protected readonly cooldownController = new TimestampController(
		"dunestrider.focus.cooldown",
		(player) => {
			return 20;
		}
	);

	protected readonly durationController = new TimestampController(
		"dunestrider.focus.duration",
		(player) => {
			return 100 + this.getChargeTime(player);
		}
	);

	protected readonly ui = new FocusUI(this.cooldownController, this.durationController);

	private readonly deactivationTick: Record<string, long | undefined> = {};


	/* -------------------------------------------------------------------------- */
	/*                                   Methods                                  */
	/* -------------------------------------------------------------------------- */
	protected override onActivate(player: ServerPlayer_): void {
		super.onActivate(player);
	}

	protected override onDeactivate(player: ServerPlayer_): void {
		super.onDeactivate(player);
	}

	public override onPress(player: ServerPlayer_): boolean {
		if (DunestriderSkills.FOCUS.isLockedFor(player)) return false;

		return super.onPress(player);
	}

	public override onTick(player: ServerPlayer_): boolean {
		if (!super.onTick(player)) return false;

		if (this.tryScheduledDeactivation(player)) {
			return false;
		}

		this.ui.updateUI(player);
		return true;
	}


	public onDamageTaken(player: ServerPlayer_): void {
		this.scheduleDeactivation(player);
	}

	public onAttack(player: ServerPlayer_): void {
		this.scheduleDeactivation(player);
	}

	public onUsedItem(player: ServerPlayer_): void {
		this.scheduleDeactivation(player);
	}



	public isActive(player: ServerPlayer_): boolean {
		return this.toggleController.isToggled(player) && this.durationController.getCurr(player) > this.getChargeTime(player);
	}

	public isActiveOrCharging(player: ServerPlayer_): boolean {
		return this.toggleController.isToggled(player);
	}

	private getChargeTime(player: ServerPlayer_): number {
		return 20;
	}

	private scheduleDeactivation(player: ServerPlayer_): void {
		if (!this.isActiveOrCharging(player)) return;

		const uuid = player.stringUUID;
		if (this.deactivationTick[uuid] !== undefined) return;

		this.deactivationTick[uuid] = TickHelper.getGameTime(player.server) + 1;
	}

	private tryScheduledDeactivation(player: ServerPlayer_): boolean {
		const time = this.deactivationTick[player.stringUUID];
		const flag = time !== undefined && time >= TickHelper.getGameTime(player.server);
		if (flag) {
			this.deactivationTick[player.stringUUID] = undefined;
			this.onDeactivate(player);
			return true;
		}
		return false;
	}
})();