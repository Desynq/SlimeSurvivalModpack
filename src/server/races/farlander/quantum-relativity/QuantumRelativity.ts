
const QuantumRelativityAbility = new (class implements IRaceAbility {

	public constructor() { }

	protected readonly toggleController = new ToggleController("farlander.quantum_relativity.toggle");

	protected readonly cooldownController = new TimestampController(
		"farlander.quantum_relativity.cooldown",
		(player: ServerPlayer) => 100
	);

	protected readonly durationController = new TimestampController(
		"farlander.quantum_relativity.duration",
		(player: ServerPlayer) => {
			const tier = SkillHelper.getSkillTier(player,
				FarlanderSkills.TIME_DILATION_1,
				FarlanderSkills.TIME_DILATION_2,
				FarlanderSkills.TIME_DILATION_3,
				FarlanderSkills.TIME_DILATION_4
			);
			switch (tier) {
				case 1:
					return 40;
				case 2:
					return 60;
				case 3:
					return 80;
				case 4:
					return 100;
				default:
					return 20;
			}
		}
	);

	protected readonly ui = new (class implements CooldownAbilityUI {
		constructor(
			private readonly cooldown: TimestampController,
			private readonly duration: TimestampController
		) { }

		public abilityEnabled(player: ServerPlayer): void {
			playsoundAll(player.server, "minecraft:entity.zombie_villager.cure", "master", 2, 1);
		}

		public abilityDisabled(player: ServerPlayer): void {
			playsoundAll(player.server, "minecraft:entity.zombie_villager.converted", "master", 2, 2);
		}

		public alertCooldownOver(player: ServerPlayer): void {
			playsound(player.level, player.position(), "minecraft:block.beacon.power_select", "master", 2, 2);
		}

		public displayCooldown(player: ServerPlayer): void {
			const timeLeft = this.cooldown.getMax(player) - this.cooldown.getCurr(player);
			ActionbarManager.addSimple(player, `Relativity CD: ${TickHelper.toSeconds(player.server, timeLeft)}`);
		}

		public updateUI(player: ServerPlayer): void {
			const max = this.duration.getMax(player);
			const curr = this.duration.getCurr(player);
			ActionbarManager.addSimple(player, `Relativity: ${max - curr}`);
		}

		public displayCooldownWarning(player: ServerPlayer): void {
			const max = this.cooldown.getMax(player);
			const curr = this.cooldown.getCurr(player);
			// @ts-ignore
			player.tell(Text.red(`Cannot activate Quantum Relativity while on cooldown. (${max - curr} ticks left)`));
		}

		public displayFoodWarning(player: ServerPlayer): void {
			// @ts-ignore
			player.tell(Text.red("Cannot activate Quantum Relativity when at or below 6 hunger points."));
		}
	})(this.cooldownController, this.durationController);



	private activateAbility(player: ServerPlayer): void {
		this.cooldownController.reset(player);
		this.durationController.update(player);
		this.ui.abilityEnabled(player);

		TickHelper.setTickRate(player.server, 10);
	}

	private disableAbility(player: ServerPlayer): void {
		this.cooldownController.update(player);
		this.ui.abilityDisabled(player);

		TickHelper.resetTickRate(player.server);
	}

	private cancelAbility(player: ServerPlayer): void {
		this.disableAbility(player);
	}

	private handleDeathWhileActive(player: ServerPlayer): void {
		this.toggleController.toggle(player);
		this.disableAbility(player);
	}

	private handleAbilityExpiration(player: ServerPlayer): void {
		this.toggleController.toggle(player);
		this.disableAbility(player);
	}

	private handleOutOfHunger(player: ServerPlayer): void {
		this.toggleController.toggle(player);
		this.disableAbility(player);
	}



	public onPress(player: ServerPlayer): void {
		if (!SkillHelper.hasSkill(player, FarlanderSkills.QUANTUM_RELATIVITY)) {
			return;
		}

		if (!this.cooldownController.hasPassed(player)) {
			this.ui.displayCooldownWarning(player);
			return;
		}

		if (player.foodLevel <= 6) {
			this.ui.displayFoodWarning(player);
			return;
		}

		if (this.toggleController.toggle(player)) {
			this.activateAbility(player);
		}
		else {
			this.cancelAbility(player);
		}
	}

	public onTick(player: ServerPlayer): void {
		if (!this.toggleController.isToggled(player)) {
			if (!this.cooldownController.hasPassed(player)) {
				this.ui.displayCooldown(player);
			}
			else if (this.cooldownController.hasJustPassed(player)) {
				this.ui.alertCooldownOver(player);
			}
			return;
		}
		if (player.isDeadOrDying()) {
			this.handleDeathWhileActive(player);
			return;
		}
		if (this.durationController.hasPassed(player)) {
			this.handleAbilityExpiration(player);
			return;
		}

		player.causeFoodExhaustion(1);
		if (player.foodLevel <= 6) {
			this.handleOutOfHunger(player);
			return;
		}

		this.ui.updateUI(player);
	}
})();