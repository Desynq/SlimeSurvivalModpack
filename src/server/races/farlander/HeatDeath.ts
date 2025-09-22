
const HeatDeathAbility = new (class extends BaseAbility {
	public constructor() {
		super();
	}

	protected readonly cooldownController = new TimestampController(
		"farlander.heat_death.cooldown",
		(player: ServerPlayer) => 1200 * 3
	);

	protected readonly ui = new (class implements IBaseAbilityUI {
		constructor(
			private readonly cooldown: TimestampController,
		) { }

		public abilityEnabled(player: ServerPlayer): void {
			playsoundAll(player.server, "minecraft:entity.wither.death", "master", 2, 2);
		}

		public alertCooldownOver(player: ServerPlayer): void {
			playsound(player.level, player.position(), "minecraft:item.firecharge.use", "master", 2, 0.5);
		}

		public displayCooldown(player: ServerPlayer): void {
			const timeLeft = this.cooldown.getMax(player) - this.cooldown.getCurr(player);
			ActionbarManager.addSimple(player, `Heat Death CD: ${TickHelper.toSeconds(player.server, timeLeft)}`);
		}

		public displayCooldownWarning(player: ServerPlayer): void {
			const max = this.cooldown.getMax(player);
			const curr = this.cooldown.getCurr(player);
			// @ts-ignore
			player.tell(Text.red(`Cannot activate Heath Death while on cooldown. (${max - curr} ticks left)`));
		}
	})(this.cooldownController);



	protected onActivate(player: ServerPlayer): void {
		super.onActivate(player);
		this.cooldownController.update(player);
		EntropyHolder.get(player)?.resetEntropy();
	}

	public onPress(player: ServerPlayer): boolean {
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