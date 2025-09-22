

const QuantumRelativityAbility = new (class extends ToggleableAbility {

	public constructor() {
		super();
	}

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

	protected readonly ui = new (class implements IToggleableAbilityUI {
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



	protected onActivate(player: ServerPlayer): void {
		super.onActivate(player);
		TickHelper.setTickRate(player.server, 10);
	}

	protected onDeactivate(player: ServerPlayer): void {
		super.onDeactivate(player);
		TickHelper.resetTickRate(player.server);
	}

	private onOutOfHunger(player: ServerPlayer): void {
		this.onDeactivate(player);
	}

	public onPress(player: ServerPlayer): boolean {
		if (!SkillHelper.hasSkill(player, FarlanderSkills.QUANTUM_RELATIVITY)) {
			return false;
		}
		if (player.foodLevel <= 6) {
			this.ui.displayFoodWarning(player);
			return false;
		}
		return super.onPress(player);
	}

	public onTick(player: ServerPlayer): boolean {
		if (!super.onTick(player)) return false;

		player.causeFoodExhaustion(1);
		if (player.foodLevel <= 6) {
			this.onOutOfHunger(player);
			return false;
		}

		this.ui.updateUI(player);
		return true;
	}
})();