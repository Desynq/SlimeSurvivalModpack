//priority: 101

const FarlanderSkillDefinitionsJson = {};

const FARLANDER_CATEGORY_ID = "slimesurvival:farlander_race";
const FarlanderSkills = {};

FarlanderSkills.QUANTUM_UNCERTAINTY = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_uncertainty")
	.effectIcon("minecraft:bad_omen")
	.advancementFrame("goal")
	.addDescription({
		"color": "dark_purple",
		"text": "You do not take damage regularly, instead you pool damage as entropy."
			+ "\n\nPooled damage decays exponentially per damage entry (-10% per entropy tick)."
			+ "\n\nEvery entropy tick, you take between 0 to 2x of the total entropy decayed in that tick as damage."
	})
	.rootSkill()
	.serialize(FarlanderSkillDefinitionsJson)
	.toSkill("m13s2aep4oet8a47");

FarlanderSkills.QUANTUM_RENDING = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_rending")
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
	.serialize(FarlanderSkillDefinitionsJson)
	.toSkill("vurcdoc6hgo5gbs1");

FarlanderSkills.QUANTUM_RENDING_2 = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_rending_2")
	.effectIcon("minecraft:wither")
	.advancementFrame("task")
	.addDescription({
		"color": "dark_purple",
		"text": "66% of damage dealt to enemies is converted to entropy damage."
	})
	.cost(2)
	.serialize(FarlanderSkillDefinitionsJson)
	.toSkill("8t8jv8hkhvrr03ym");

FarlanderSkills.QUANTUM_DELAY_1 = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_delay_1")
	.effectIcon("minecraft:slowness")
	.advancementFrame("task")
	.addDescription({
		"color": "dark_purple",
		"text": "Entropy pool is ticked every other tick."
	})
	.cost(1)
	.serialize(FarlanderSkillDefinitionsJson)
	.toSkill("gwptyt8ifed0x4ws");

FarlanderSkills.QUANTUM_DELAY_2 = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_delay_2")
	.effectIcon("minecraft:slowness")
	.advancementFrame("task")
	.addDescription({
		"color": "dark_purple",
		"text": "Entropy pool is ticked every 4 ticks."
			+ "\n+100% Entropy decay"
	})
	.cost(2)
	.serialize(FarlanderSkillDefinitionsJson)
	.toSkill("98tad3k5fkvvfnur");



FarlanderSkills.HEAT_DEATH = new SkillDefinition(FARLANDER_CATEGORY_ID, "heat_death")
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
			+ "\n\n- Cooldown of 3 minutes."
	})
	.cost(6)
	.serialize(FarlanderSkillDefinitionsJson)
	.toSkill("smunmehdt68srjgt");



// Quantum Relativity Skills

FarlanderSkills.QUANTUM_RELATIVITY = new SkillDefinition(FARLANDER_CATEGORY_ID, "quantum_relativity")
	.itemIcon("minecraft:clock")
	.advancementFrame("challenge")
	.addDescription({
		"color": "dark_purple",
		"text": "Pressing"
	})
	.addKeybindDescription("key.slimesurvival.primary_ability")
	.addDescription({
		"color": "dark_purple",
		"text": "will temporarily lower tick rate to 10 ticks per second."
			+ "\n- Can be cancelled early."
			+ "\n- Maximum duration of 20 ticks."
			+ "\n- Cooldown of 5 seconds."
	})
	.cost(4)
	.serialize(FarlanderSkillDefinitionsJson)
	.toSkill("cspxfslrz4c6380l");

/**
 * 
 * @param {integer} tier 
 * @param {integer} time 
 * @param {integer} cost 
 * @param {string} skillId 
 * @returns 
 */
function createTimeDilationSkill(tier, time, cost, skillId) {
	return new SkillDefinition(FARLANDER_CATEGORY_ID, `time_dilation_${tier}`)
		.itemIcon("minecraft:popped_chorus_fruit")
		.advancementFrame("task")
		.addDescription({
			"color": "dark_purple",
			"text": `Quantum Relativity now lasts for ${time} ticks.`
		})
		.cost(cost)
		.serialize(FarlanderSkillDefinitionsJson)
		.toSkill(skillId);
}

FarlanderSkills.TIME_DILATION_1 = createTimeDilationSkill(1, 40, 4, "cyegh5wlrtb4sgkj");
FarlanderSkills.TIME_DILATION_2 = createTimeDilationSkill(2, 60, 3, "39kjaql5l1rklarp");
FarlanderSkills.TIME_DILATION_3 = createTimeDilationSkill(3, 80, 2, "w00u8zs19gzuq4rv");
FarlanderSkills.TIME_DILATION_4 = createTimeDilationSkill(4, 100, 2, "9tmcgff92ez7n8rp");