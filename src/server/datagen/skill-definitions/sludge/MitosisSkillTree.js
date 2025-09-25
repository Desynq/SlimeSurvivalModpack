// priority: 100

const MitosisSkillTree = {
	MITOSIS: new SkillDefinition(SludgeSkillsCategoryId, "mitosis")
		.effectIcon("minecraft:regeneration")
		.addDescription({
			"color": "aqua",
			"text": "Passively regenerate 1 health every 5 seconds at the cost of 1 hunger point."
		})
		.cost(1)
		.serialize(SludgeDefinitionsJson)
		.toSkill("cdw1xwwww7rsxbvx"),

	APOPTOSIS: new SkillDefinition(SludgeSkillsCategoryId, "apoptosis")
		.effectIcon("minecraft:hunger")
		.addDescription({
			"color": "dark_red",
			"text": "Mitosis now works until starvation.\n-50% hunger drain per mitosis tick."
		})
		.cost(2)
		.serialize(SludgeDefinitionsJson)
		.toSkill("4yjkeqmp04gygc04"),

	MITOTIC_ACCELERATION_1: new SkillDefinition(SludgeSkillsCategoryId, "mitotic_acceleration_1")
		.itemIcon("minecraft:clock")
		.addDescription({
			"color": "aqua",
			"text": "Mitosis now occurs every 4 seconds."
		})
		.cost(1)
		.serialize(SludgeDefinitionsJson)
		.toSkill("xj64dsjei37hvgax"),

	MITOTIC_ACCELERATION_2: new SkillDefinition(SludgeSkillsCategoryId, "mitotic_acceleration_2")
		.itemIcon("minecraft:clock")
		.addDescription({
			"color": "aqua",
			"text": "Mitosis now occurs every 3 seconds."
		})
		.cost(2)
		.serialize(SludgeDefinitionsJson)
		.toSkill("lsce7nkfd76wytmm"),

	MITOTIC_ACCELERATION_3: new SkillDefinition(SludgeSkillsCategoryId, "mitotic_acceleration_3")
		.itemIcon("minecraft:clock")
		.addDescription({
			"color": "aqua",
			"text": "Mitosis now occurs every 2 seconds."
		})
		.cost(3)
		.serialize(SludgeDefinitionsJson)
		.toSkill("64ckkk2rx7hfvkqq"),

	MITOTIC_ACCELERATION_4: new SkillDefinition(SludgeSkillsCategoryId, "mitotic_acceleration_4")
		.itemIcon("minecraft:clock")
		.addDescription({
			"color": "aqua",
			"text": "Mitosis now occurs every second."
		})
		.cost(4)
		.serialize(SludgeDefinitionsJson)
		.toSkill("y2fpcywmblqtu859"),
};

SludgeSkills.MITOSIS = MitosisSkillTree.MITOSIS;
SludgeSkills.MITOTIC_ACCELERATION_1 = MitosisSkillTree.MITOTIC_ACCELERATION_1;
SludgeSkills.MITOTIC_ACCELERATION_2 = MitosisSkillTree.MITOTIC_ACCELERATION_2;
SludgeSkills.MITOTIC_ACCELERATION_3 = MitosisSkillTree.MITOTIC_ACCELERATION_3;
SludgeSkills.MITOTIC_ACCELERATION_4 = MitosisSkillTree.MITOTIC_ACCELERATION_4;