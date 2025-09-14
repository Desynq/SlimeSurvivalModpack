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