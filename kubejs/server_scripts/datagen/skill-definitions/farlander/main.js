const FarlanderSkillDefinitionsJson = {};

const FarlanderSkills = {};

FarlanderSkills.QUANTUM_UNCERTAINTY = new SkillDefinition("slimesurvival:farlander_race", "quantum_uncertainty")
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