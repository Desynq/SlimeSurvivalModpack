//priority: 101

const FarlanderSkillDefinitionsJson = {};

const FARLANDER_CATEGORY_ID = "slimesurvival:farlander_race";

class FarlanderSkills {
	public static readonly skills: Skill[] = [];

	public static readonly QUANTUM_UNCERTAINTY = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_uncertainty")
		.effectIcon("minecraft:bad_omen")
		.advancementFrame("goal")
		.addDescription({
			"color": "dark_purple",
			"text": "You do not take damage regularly, instead you pool damage as entropy."
				+ "\n\nPooled damage decays exponentially per damage entry (-10% per entropy tick)."
				+ "\n\nEvery entropy tick, you take between 0 to 2x of the total entropy decayed in that tick as damage."
		})
		.rootSkill()
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);

	public static readonly QUANTUM_RENDING = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_rending")
		.effectIcon("minecraft:wither")
		.advancementFrame("task")
		.addDescription({
			"color": "dark_purple",
			"text": "33% of damage dealt to enemies is converted to entropy damage."
		})
		.addDescription({
			"color": "dark_purple",
			"text": "\n\nEntropy damage dealt to enemies decays 10% per tick."
		})
		.addDescription({
			"color": "dark_purple",
			"text": "\n\nDecayed entropy does 0.5 to 2.0 damage with a median of 1.25 to enemies."
		})
		.cost(1)
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);

	public static readonly QUANTUM_RENDING_2 = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_rending_2")
		.effectIcon("minecraft:wither")
		.advancementFrame("task")
		.addDescription({
			"color": "dark_purple",
			"text": "66% of damage dealt to enemies is converted to entropy damage."
		})
		.cost(2)
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);

	public static readonly QUANTUM_RENDING_3 = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_rending_3")
		.effectIcon("minecraft:wither")
		.advancementFrame("task")
		.addDescription({
			"color": "dark_purple",
			"text": "100% of damage dealt to enemies is converted to entropy damage."
		})
		.cost(4)
		.flagWIP()
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);

	public static readonly QUANTUM_DELAY_1 = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_delay_1")
		.effectIcon("minecraft:slowness")
		.advancementFrame("task")
		.addDescription({
			"color": "dark_purple",
			"text": "Entropy pool is ticked every other tick."
		})
		.cost(1)
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);

	public static readonly QUANTUM_DELAY_2 = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_delay_2")
		.effectIcon("minecraft:slowness")
		.advancementFrame("task")
		.addDescription({
			"color": "dark_purple",
			"text": "Entropy pool is ticked every 4 ticks."
				+ "\n+50% Entropy decay"
		})
		.cost(2)
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);

	public static readonly CAUSALITY_COLLAPSE = new SkillDefinition(FARLANDER_CATEGORY_ID, "causality_collapse")
		.itemIcon("endermanoverhaul:corrupted_pearl")
		.addDescription({
			"color": "dark_purple",
			"text": "Killing your attacker removes their entropy damage from your current entropy pool."
		})
		.cost(2)
		.flagWIP()
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);

	public static readonly QUANTUM_SUSPENSION = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_suspension")
		.itemIcon("endermanoverhaul:icy_pearl")
		.addDescription({
			"color": "dark_purple",
			"text": "Your entropy pool doesn't tick while Quantum Relativity is active."
				+ "\nInstead you take `entropyPool / maxHealth * 4` exhaustion per tick."
				+ "\nYou will at minimum still take the base exhaustion rate."
		})
		.cost(2)
		.flagWIP()
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);

	public static readonly QUANTUM_PREDATION = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_predation")
		.itemIcon("endermanoverhaul:enderman_tooth")
		.addDescription({
			"color": "dark_purple",
			"text": "You regenerate `entropyDamage / maxHealth * 0.25` you deal to others as hunger while Quantum Relativity is active."
		})
		.cost(2)
		.requiredSkills(2)
		.flagWIP()
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);

	public static readonly LORENTZ_CURVE = new SkillDefinition(FARLANDER_CATEGORY_ID, "lorentz_curve")
		.itemIcon("minecraft:arrow")
		.addDescription({
			"color": "dark_purple",
			"text": "Quantum relativity does not affect your projectiles."
		})
		.cost(1)
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);



	public static readonly HEAT_DEATH = new SkillDefinition(FARLANDER_CATEGORY_ID, "heat_death")
		.itemIcon("endermanoverhaul:crimson_pearl")
		.advancementFrame("challenge")
		.addDescription({
			"color": "dark_red",
			"text": "Pressing"
		})
		.addKeybindDescription("key.slimesurvival.secondary_ability")
		.addDescription({
			"color": "dark_red",
			"text": "will clear all of your current entropy."
				+ "\n\n- Cooldown of 30 seconds."
		})
		.cost(2)
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);

	public static readonly QUANTUM_ECHO = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_echo")
		.itemIcon("minecraft:echo_shard")
		.addDescription({
			"color": "dark_red",
			"text": "Heat death causes all enemies that you currently have tagged with entropy to take their lifetime entropy damage back into their entropy pool."
		})
		.cost(2)
		.requiredSkills(2)
		.flagWIP()
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);

	public static readonly QUANTUM_PHOENIX = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_phoenix")
		.itemIcon("cataclysm:flame_eye")
		.addDescription({
			"color": "dark_red",
			"text": "If heat death is not on cooldown, auto-proc heat death when you die and consume all hunger, healing `hunger / 20 * maxHealth` health."
		})
		.cost(4)
		.flagWIP()
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);

	public static readonly QUANTUM_TUNNELING = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_tunneling")
		.itemIcon("minecraft:ender_pearl")
		.addDescription({
			"color": "dark_aqua",
			"text": "You do not consume ender pearls when using them while Quantum Relativity is active."
		})
		.cost(1)
		.flagWIP()
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);



	// Quantum Relativity Skills

	public static readonly QUANTUM_RELATIVITY = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_relativity")
		.itemIcon("minecraft:clock")
		.advancementFrame("challenge")
		.addDescription({
			"color": "dark_purple",
			"text": "Pressing"
		})
		.addKeybindDescription("key.slimesurvival.primary_ability")
		.addDescription({
			"color": "dark_purple",
			"text": `will temporarily lower tick rate to ${FarlanderSkillData.QUANTUM_RELATIVITY_TICK_RATE} ticks per second.`
				+ "\n- Can be cancelled early."
				+ `\n- Maximum duration of ${FarlanderSkillData.QUANTUM_RELATIVITY_DURATION_TICK} ticks.`
				+ `\n- Cooldown of ${FarlanderSkillData.QUANTUM_RELATIVITY_COOLDOWN_SECONDS} seconds.`
		})
		.cost(3)
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);


	public static readonly TIME_DILATION_1 = this.createTimeDilationSkill(1, 1);
	public static readonly TIME_DILATION_2 = this.createTimeDilationSkill(2, 2);
	public static readonly TIME_DILATION_3 = this.createTimeDilationSkill(3, 2);
	public static readonly TIME_DILATION_4 = this.createTimeDilationSkill(4, 2);

	public static readonly EVENT_HORIZON = new SkillDefinition(FARLANDER_CATEGORY_ID, "event_horizon")
		.itemIcon("endermanoverhaul:summoner_pearl")
		.addDescription({
			"color": "dark_aqua",
			"text": "Enemies that die from your entropy damage while Quantum Relativity is active heal you based on how much entropy damage they took over their lifespan."
		})
		.addDescription({
			"color": "dark_red",
			"text": "\n\n- Requires Quantum Relativity and Quantum Rending."
		})
		.cost(3)
		.requiredSkills(2)
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);



	private static createTimeDilationSkill(tier: integer, cost: integer): Skill {
		return new SkillDefinition(FARLANDER_CATEGORY_ID, `time_dilation_${tier}`)
			.itemIcon("minecraft:popped_chorus_fruit")
			.advancementFrame("task")
			.addDescription({
				"color": "dark_purple",
				"text": `Quantum Relativity now lasts for ${FarlanderSkillData.TIME_DILATION_DURATION_TICK[tier - 1]} ticks.`
			})
			.cost(cost)
			.serializeIntoSkill(FarlanderSkillDefinitionsJson)
			.register(this.skills);
	}
}