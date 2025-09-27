

const QuantumRelativityAbility = new (class extends ToggleableAbility {

	public constructor() {
		super();
	}

	protected readonly toggleController = new ToggleController("farlander.quantum_relativity.toggle");

	protected readonly cooldownController = new TimestampController(
		"farlander.quantum_relativity.cooldown",
		(player: ServerPlayer_) => FarlanderSkillData.QUANTUM_RELATIVITY_COOLDOWN_SECONDS * TickHelper.getDefaultTickRate(player.server)
	);

	protected readonly durationController = new TimestampController(
		"farlander.quantum_relativity.duration",
		(player: ServerPlayer_) => {
			const tier = SkillHelper.getSkillTier(player,
				FarlanderSkills.TIME_DILATION_1,
				FarlanderSkills.TIME_DILATION_2,
				FarlanderSkills.TIME_DILATION_3,
				FarlanderSkills.TIME_DILATION_4
			);

			if (tier <= 0) return FarlanderSkillData.QUANTUM_RELATIVITY_DURATION_TICK;
			return FarlanderSkillData.TIME_DILATION_DURATION_TICK[tier - 1];
		}
	);

	protected readonly ui = new (class implements IToggleableAbilityUI {
		constructor(
			private readonly cooldown: TimestampController,
			private readonly duration: TimestampController
		) { }

		public abilityEnabled(player: ServerPlayer_): void {
			playsoundAll(player.server, "minecraft:entity.zombie_villager.cure", "master", 2, 1);
		}

		public abilityDisabled(player: ServerPlayer_): void {
			playsoundAll(player.server, "minecraft:entity.zombie_villager.converted", "master", 2, 2);
		}

		public alertCooldownOver(player: ServerPlayer_): void {
			playsound(player.level, player.position(), "minecraft:block.beacon.power_select", "master", 2, 2);
		}

		public displayCooldown(player: ServerPlayer_): void {
			const timeLeft = this.cooldown.getMax(player) - this.cooldown.getCurr(player);
			ActionbarManager.addSimple(player, `Relativity CD: ${TickHelper.toSeconds(player.server, timeLeft)}`);
		}

		public updateUI(player: ServerPlayer_): void {
			const max = this.duration.getMax(player);
			const curr = this.duration.getCurr(player);
			ActionbarManager.addSimple(player, `Relativity: ${max - curr}`);
		}

		public displayCooldownWarning(player: ServerPlayer_): void {
			const max = this.cooldown.getMax(player);
			const curr = this.cooldown.getCurr(player);
			// @ts-ignore
			player.tell(Text.red(`Cannot activate Quantum Relativity while on cooldown. (${max - curr} ticks left)`));
		}

		public displayFoodWarning(player: ServerPlayer_): void {
			// @ts-ignore
			player.tell(Text.red("Cannot activate Quantum Relativity when at or below 6 hunger points."));
		}
	})(this.cooldownController, this.durationController);



	protected onActivate(player: ServerPlayer_): void {
		super.onActivate(player);
		TickHelper.setTickRate(player.server, FarlanderSkillData.QUANTUM_RELATIVITY_TICK_RATE);
	}

	protected onDeactivate(player: ServerPlayer_): void {
		super.onDeactivate(player);
		TickHelper.resetTickRate(player.server);
	}

	private onOutOfHunger(player: ServerPlayer_): void {
		this.onDeactivate(player);
	}

	public onPress(player: ServerPlayer_): boolean {
		if (!SkillHelper.hasSkill(player, FarlanderSkills.QUANTUM_RELATIVITY)) {
			return false;
		}
		if (player.foodLevel <= 6) {
			this.ui.displayFoodWarning(player);
			return false;
		}
		return super.onPress(player);
	}

	public onTick(player: ServerPlayer_): boolean {
		if (!super.onTick(player)) return false;

		player.causeFoodExhaustion(1);
		if (player.foodLevel <= 6) {
			this.onOutOfHunger(player);
			return false;
		}

		this.ui.updateUI(player);
		return true;
	}

	public isActive(player: ServerPlayer_) {
		return this.toggleController.isToggled(player);
	}
})();