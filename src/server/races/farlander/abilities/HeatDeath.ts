
const HeatDeathAbility = new (class extends BaseAbility {
	public constructor() {
		super();
	}

	protected readonly cooldownController = new TimestampController(
		"farlander.heat_death.cooldown",
		(player: ServerPlayer_) => 1200 * 0.5
	);

	protected readonly ui = new (class implements IBaseAbilityUI {
		public constructor(
			private readonly cooldown: TimestampController,
		) { }

		public abilityEnabled(player: ServerPlayer_): void {
			PlaysoundHelper.playsound(player.level, player.position(), "entity.wither.spawn", "master", 1, 2);
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

		public playQuantumEcho(level: ServerLevel_, pos: Vec3_): void {
			playsound(level, pos, "entity.elder_guardian.curse", "ambient", 1, 2);
		}
	})(this.cooldownController);



	protected override onActivate(player: ServerPlayer_): void {
		super.onActivate(player);
		this.cooldownController.update(player);

		EntropyHolder.get(player)?.resetEntropy();
		this.quantumCleansing(player);
		this.quantumEcho(player);
	}

	private quantumCleansing(player: ServerPlayer_): void {
		if (!SkillHelper.hasSkill(player, FarlanderSkills.QUANTUM_CLEANSING)) return;

		LivingEntityHelper.removeHarmfulEffects(player);
	}

	private quantumEcho(attacker: ServerPlayer_): void {
		if (FarlanderSkills.QUANTUM_ECHO.isLockedFor(attacker)) return;

		const holders = EntropyHolder.getHoldersWithAttackerEntropy(attacker);
		for (const holder of holders) {
			const entity = attacker.server.getEntityByUUID(holder.uuid);
			if (!entity) continue;

			const currentEntropy = holder.getTotalEntropyFrom(attacker);
			holder.pushEntropyEntry(currentEntropy, attacker);

			this.ui.playQuantumEcho(entity.level as any, entity.position());
		}
	}

	public override onPress(player: ServerPlayer_): boolean {
		if (!SkillHelper.hasSkill(player, FarlanderSkills.HEAT_DEATH)) {
			return false;
		}

		// don't let players accidentally proc the ability after just dying
		if (player.stats.timeSinceDeath < 20) return false;

		if (!super.onPress(player)) {
			return false;
		}

		this.onActivate(player);
		return true;
	}
})();