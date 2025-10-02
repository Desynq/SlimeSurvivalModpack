
const HeatDeathAbility = new (class extends BaseAbility {
	public constructor() {
		super();
	}

	protected readonly cooldownController = new TimestampController(
		"farlander.heat_death.cooldown",
		(player: ServerPlayer_) => 1200 * 0.5
	);

	protected readonly ui = new (class implements IBaseAbilityUI {
		constructor(
			private readonly cooldown: TimestampController,
		) { }

		public abilityEnabled(player: ServerPlayer_): void {
			playsoundAll(player.server, "entity.wither.death", "master", 1, 2);
		}

		public alertCooldownOver(player: ServerPlayer_): void {
			playsound(player.level, player.position(), "item.trident.return", "master", 2, 0.5);
		}

		public displayCooldown(player: ServerPlayer_): void {
			const timeLeft = this.cooldown.getMax(player) - this.cooldown.getCurr(player);
			ActionbarManager.addSimple(player, `Heat Death CD: ${TickHelper.toSeconds(player.server, timeLeft)}`);
		}

		public displayCooldownWarning(player: ServerPlayer_): void {
			const max = this.cooldown.getMax(player);
			const curr = this.cooldown.getCurr(player);
			// @ts-ignore
			player.tell(Text.red(`Cannot activate Heath Death while on cooldown. (${max - curr} ticks left)`));
		}
	})(this.cooldownController);



	protected onActivate(player: ServerPlayer_): void {
		super.onActivate(player);
		this.cooldownController.update(player);

		EntropyHolder.get(player)?.resetEntropy();
		this.quantumCleansing(player);
	}

	private quantumCleansing(player: ServerPlayer_): void {
		if (!SkillHelper.hasSkill(player, FarlanderSkills.QUANTUM_CLEANSING)) return;

		LivingEntityHelper.removeHarmfulEffects(player);
	}

	public onPress(player: ServerPlayer_): boolean {
		if (!SkillHelper.hasSkill(player, FarlanderSkills.HEAT_DEATH)) {
			return false;
		}
		if (!super.onPress(player)) {
			return false;
		}
		this.onActivate(player);
		return true;
	}
})();