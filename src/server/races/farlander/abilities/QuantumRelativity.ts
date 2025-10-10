

const QuantumRelativity = new (class extends ToggleableAbility {

	public constructor() {
		super();
	}

	protected readonly toggleController = new ToggleController("farlander.quantum_relativity.toggle");

	protected readonly cooldownController = new TimestampController(
		"farlander.quantum_relativity.cooldown",
		(player: ServerPlayer_) => {
			let cooldown = FarlanderSkillData.QUANTUM_RELATIVITY_COOLDOWN_SECONDS * TickHelper.getDefaultTickRate(player.server);

			const compressionTier = SkillHelper.getSkillTier(player,
				FarlanderSkills.RELATIVE_COMPRESSION_1,
				FarlanderSkills.RELATIVE_COMPRESSION_2,
				FarlanderSkills.RELATIVE_COMPRESSION_3,
			);
			switch (compressionTier) {
				case 1:
					cooldown *= 0.8;
					break;
				case 2:
					cooldown *= 0.4;
					break;
				case 3:
					cooldown *= 0.2;
					break;
			}
			return Math.ceil(cooldown);
		}
	);

	protected readonly durationController = new TimestampController(
		"farlander.quantum_relativity.duration",
		(player: ServerPlayer_) => {
			const dilationTier = SkillHelper.getSkillTier(player,
				FarlanderSkills.TIME_DILATION_1,
				FarlanderSkills.TIME_DILATION_2,
				FarlanderSkills.TIME_DILATION_3,
				FarlanderSkills.TIME_DILATION_4
			);

			let duration = dilationTier <= 0
				? FarlanderSkillData.QUANTUM_RELATIVITY_DURATION_TICK
				: FarlanderSkillData.TIME_DILATION_DURATION_TICK[dilationTier - 1];

			const compressionTier = SkillHelper.getSkillTier(player,
				FarlanderSkills.RELATIVE_COMPRESSION_1,
				FarlanderSkills.RELATIVE_COMPRESSION_2,
				FarlanderSkills.RELATIVE_COMPRESSION_3,
			);
			switch (compressionTier) {
				case 1:
					duration *= 0.75;
					break;
				case 2:
					duration *= 0.5;
					break;
				case 3:
					duration *= 0.25;
					break;
			}

			return Math.ceil(duration);
		}
	);

	protected readonly ui = new (class implements IToggleableAbilityUI {
		public constructor(
			private readonly cooldown: TimestampController,
			private readonly duration: TimestampController
		) { }

		public abilityEnabled(player: ServerPlayer_): void {
			playsoundAll(player.server, "minecraft:entity.zombie_villager.cure", "ambient", 2, 1);
		}

		public abilityDisabled(player: ServerPlayer_): void {
			playsoundAll(player.server, "minecraft:entity.zombie_villager.converted", "ambient", 2, 2);
		}

		public alertCooldownOver(player: ServerPlayer_): void {
			playsound(player.level, player.position(), "minecraft:block.beacon.power_select", "player", 1, 2);
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


	private readonly ATTACK_SPEED_MODIFIER = new AttributeModifierController("generic.attack_speed", "ability.quantum_relativity.attack_speed", 1, "add_multiplied_total");
	private readonly MOVEMENT_SPEED_MODIFIER = new AttributeModifierController("generic.movement_speed", "ability.quantum_relativity.movement_speed", 1, "add_multiplied_total");

	protected override onActivate(player: ServerPlayer_): void {
		super.onActivate(player);

		if (this.canOverrideTickRate(player)) {
			TickHelper.setTickRate(player.server, FarlanderSkillData.QUANTUM_RELATIVITY_TICK_RATE);
		}

		if (FarlanderSkills.THE_WORLD.isUnlockedFor(player)) {
			this.ATTACK_SPEED_MODIFIER.add(player);
			this.MOVEMENT_SPEED_MODIFIER.add(player);
		}
	}

	protected override onDeactivate(player: ServerPlayer_): void {
		super.onDeactivate(player);

		if (this.canOverrideTickRate(player)) {
			TickHelper.resetTickRate(player.server);
		}

		this.ATTACK_SPEED_MODIFIER.remove(player);
		this.MOVEMENT_SPEED_MODIFIER.remove(player);
	}

	/**
	 * Player cannot override tick rate if there's another farlander with relativity active
	 */
	private canOverrideTickRate(player: ServerPlayer_): boolean {
		return ServerHelper.getPlayers(player.server)
			.every(other => other === player || !this.isActive(other));
	}

	private onOutOfHunger(player: ServerPlayer_): void {
		this.onDeactivate(player);
	}

	public onDisconnect(player: ServerPlayer_): void {
		this.onDeactivate(player);
	}

	public override onPress(player: ServerPlayer_): boolean {
		if (!SkillHelper.hasSkill(player, FarlanderSkills.QUANTUM_RELATIVITY)) {
			return false;
		}
		if (player.foodLevel <= 6) {
			this.ui.displayFoodWarning(player);
			return false;
		}
		return super.onPress(player);
	}

	public override onTick(player: ServerPlayer_): boolean {
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

	/**
	 * A projectile is a lorentz projectile if its owner has Lorentz Curve and the owner isn't crouching.
	 */
	public isLorentzProjectile(entity: Projectile_): boolean {
		const owner = entity.getOwner();
		if (!(owner instanceof $ServerPlayer)) return false;

		if (owner.crouching) return false;

		if (!SkillHelper.hasSkill(owner, FarlanderSkills.LORENTZ_CURVE)) return false;

		if (!this.isActive(owner)) return false;

		return true;
	}
})();