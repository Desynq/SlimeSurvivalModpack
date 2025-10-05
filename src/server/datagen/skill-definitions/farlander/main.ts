//priority: 101

const FarlanderSkillDefinitionsJson = {};

const FARLANDER_CATEGORY_ID = "slimesurvival:farlander_race";

class FarlanderSkills {
	public static readonly skills: Skill[] = [];

	private static createSkill(id: string, fn: (def: SkillDefinition) => void): Skill {
		const def = new SkillDefinition(FARLANDER_CATEGORY_ID, id);
		fn(def);
		return def.serializeIntoSkill(FarlanderSkillDefinitionsJson).register(this.skills);
	}

	public static readonly QUANTUM_UNCERTAINTY = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_uncertainty")
		.effectIcon("minecraft:bad_omen")
		.addDescription({
			"color": "dark_purple",
			"text": "You do not take damage regularly, instead you pool damage as entropy."
				+ "\n\nPooled damage decays exponentially per damage entry (-10% per entropy tick)."
				+ "\n\nEvery entropy tick, you take between 0 to 2x of the total entropy decayed in that tick as damage."
		})
		.size(1.25)
		.rootSkill()
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);

	public static readonly NUTRITIONAL_UNCERTAINTY = this.createSkill("nutritional_uncertainty", def => def
		.itemIcon("minecraft:suspicious_stew")
		.addDescription({
			"color": "dark_purple",
			"text": "How can you be sure what you ate was saturating if you're still hungry?"
				+ "\n\n- Food does not give saturation unless you get to max hunger from eating it."
		})
		.size(1.25)
		.rootSkill()
	);

	public static readonly CRITICAL_UNCERTAINTY = this.createSkill("critical_uncertainty", def => def
		.effectIcon("slimesurvival:weak_knees")
		.addDescription({
			"color": "dark_purple",
			"text": "Did you land that crit?"
				+ "\n\n- Critical hits have a chance to not land."
				+ "\n\n- Chance is `1 - health / maxHealth`"
		})
		.size(1.25)
		.rootSkill()
		.flagPlanned()
	);

	public static readonly QUANTUM_RENDING = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_rending")
		.effectIcon("minecraft:wither")
		.advancementFrame("task")
		.addDescription({
			"color": "dark_purple",
			"text": "33% of damage dealt to enemies is converted to entropy damage."
		})
		.addDescription({
			"color": "dark_purple",
			"text": "\n\nEntropy damage dealt to enemies decays 10% per game tick."
		})
		.addDescription({
			"color": "dark_purple",
			"text": "\n\nDecayed entropy does 0.5x to 2.0x damage with a median of 1.25x to enemies."
		})
		.size(1.25)
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
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);

	// TODO
	public static readonly CAUSALITY_CLEANSE = this.createSkill("causality_cleanse", def => def
		.itemIcon("splash_milk:lingering_milk_bottle")
		.addDescription({
			"color": "dark_purple",
			"text": "Killing your attacker also removes any negative effects obtained from them."
		})
		.cost(2)
		.flagPlanned()
	);

	// TODO:
	public static readonly QUANTUM_SUSPENSION = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_suspension")
		.itemIcon("endermanoverhaul:icy_pearl")
		.addDescription({
			"color": "dark_purple",
			"text": "Your entropy pool doesn't tick while Quantum Relativity is active."
				+ "\nInstead you take `entropyPool / maxHealth * 4` exhaustion per tick."
				+ "\nYou will at minimum still take the base exhaustion rate."
		})
		.cost(2)
		.flagPlanned()
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);

	// TODO:
	public static readonly QUANTUM_PREDATION = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_predation")
		.itemIcon("endermanoverhaul:enderman_tooth")
		.addDescription({
			"color": "dark_purple",
			"text": "You regenerate `entropyDamage / maxHealth * 0.25` you deal to others as hunger while Quantum Relativity is active."
		})
		.cost(2)
		.requiredSkills(2)
		.flagPlanned()
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);

	public static readonly LORENTZ_CURVE = new SkillDefinition(FARLANDER_CATEGORY_ID, "lorentz_curve")
		.itemIcon("minecraft:arrow")
		.addDescription({
			"color": "dark_purple",
			"text": "Your projectiles travel normally while Quantum Relativity is active."
				+ "\n\n- Crouching temporarily toggles ability off."
				+ "\n\n- Affected projectiles are difficult to observe."
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
		.size(1.25)
		.cost(2)
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);

	// TODO:
	public static readonly QUANTUM_ECHO = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_echo")
		.itemIcon("minecraft:echo_shard")
		.addDescription({
			"color": "dark_red",
			"text": "Heat death causes all enemies that you currently have tagged with entropy to take their lifetime entropy damage back into their entropy pool."
		})
		.cost(4)
		.requiredSkills(2)
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);

	// TODO:
	public static readonly QUANTUM_PHOENIX = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_phoenix")
		.itemIcon("cataclysm:flame_eye")
		.addDescription({
			"color": "dark_red",
			"text": "If Heat Death is not on cooldown, auto-proc Heat Death when you die and consume all hunger, healing `hunger / 20 * maxHealth` health."
		})
		.cost(4)
		.flagPlanned()
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);

	public static readonly QUANTUM_TUNNELING = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_tunneling")
		.itemIcon("minecraft:ender_pearl")
		.addDescription({
			"color": "dark_aqua",
			"text": "Ender pearls do not get consumed or cause fall damage while Quantum Relativity is active."
		})
		.cost(1)
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);

	public static readonly CASUAL_TRANSFERENCE = new SkillDefinition(FARLANDER_CATEGORY_ID, "casual_transference")
		.itemIcon("minecraft:tnt_minecart")
		.addDescription({
			"color": "dark_purple",
			"text": "When an enemy dies, any entropy they have left over that you've dealt to them is passed onto the closest enemy to you that currently has entropy from you."
		})
		.cost(2)
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);

	public static readonly COHERENCE_1 = new SkillDefinition(FARLANDER_CATEGORY_ID, "coherence_1")
		.itemIcon("minecraft:heart_of_the_sea")
		.addDescription({
			"color": "dark_purple",
			"text": "Entropy you deal to others now takes 4 ticks longer to decay with a new median damage of 1.5x."
		})
		.cost(2)
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);

	public static readonly OBSERVER_EFFECT = new SkillDefinition(FARLANDER_CATEGORY_ID, "observer_effect")
		.itemIcon("minecraft:ender_eye")
		.addDescription({
			"color": "dark_purple",
			"text": "Casual Transference defaults to the nearest mob currently targeting you if its initial search condition fails."
		})
		.cost(4)
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);

	public static readonly QUANTUM_CLEANSING = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_cleansing")
		.itemIcon("minecraft:milk_bucket")
		.addDescription({
			"color": "dark_purple",
			"text": "Heat Death clears all negative effects on activation."
		})
		.cost(2)
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);

	// TODO
	public static readonly INFORMATION_PARADOX = new SkillDefinition(FARLANDER_CATEGORY_ID, "information_paradox")
		.effectIcon("minecraft:blindness")
		.addDescription({
			"color": "dark_purple",
			"text": "Heat Death gives all decaying or targeting enemies Blindness IV for 10 seconds."
				+ "\nNote: Each level of blindness reduces follow range by 20%."
		})
		.cost(2)
		.flagPlanned()
		.serializeIntoSkill(FarlanderSkillDefinitionsJson)
		.register(this.skills);



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
				+ `\n- Drains ${FarlanderSkillData.QUANTUM_RELATIVITY_EXHAUSTION_PER_TICK * 0.25} hunger per tick.`
				+ `\n- Requires > ${FarlanderSkillData.QUANTUM_RELATIVITY_HUNGER_THRESHOLD} hunger to activate.`
				+ `\n- Automatically deactivates when hunger <= ${FarlanderSkillData.QUANTUM_RELATIVITY_HUNGER_THRESHOLD}.`
		})
		.size(1.25)
		.cost(3)
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
}