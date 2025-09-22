// priority: 101
const SludgeDefinitionsJson = {};

const SludgeSkills = {}
SludgeSkills.FLAMMABLE = new SkillDefinition(SludgeSkillsCategoryId, "flammable")
	.advancementFrame("goal")
	.itemIcon("minecraft:flint_and_steel")
	.addDescription({
		"color": "red",
		"text": "Fire does not extinguish naturally over time. You have to extinguish yourself in water or die trying."
	})
	.rootSkill()
	.addAttributeReward("minecraft:generic.burning_time", 2147483647, "multiply_base")
	.serialize(SludgeDefinitionsJson)
	.toSkill("s9il1r95zp4fg5vl");





SludgeSkills.SLIMEPROOF = new SkillDefinition(SludgeSkillsCategoryId, "slimeproof")
	.advancementFrame("goal")
	.itemIcon("minecraft:slime_block")
	.addDescription({
		"color": "green",
		"text": "Medium-sized slimes do not hurt you."
	})
	.rootSkill()
	.serialize(SludgeDefinitionsJson)
	.toSkill("hi8bub7iluizrm0t");

SludgeSkills.NATURAL_ECONOMIST = new SkillDefinition(SludgeSkillsCategoryId, "natural_economist")
	.itemIcon("minecraft:emerald")
	.addDescription({
		"color": "green",
		"text": "You can sell slime for $2.00 instead of $1.00."
	})
	.cost(1)
	.serialize(SludgeDefinitionsJson)
	.toSkill("");




SludgeSkills.AREGENERATIVE = new SkillDefinition(SludgeSkillsCategoryId, "aregenerative")
	.advancementFrame("goal")
	.effectIcon("minecraft:wither")
	.addDescription({
		"color": "red",
		"text": "You do not regenerate naturally through saturation."
	})
	.rootSkill()
	.addTagReward("sludge.no_natural_regeneration")
	.serialize(SludgeDefinitionsJson)
	.toSkill("1eo7ddidgilk3911");






SludgeSkills.PSEUDOPODIA = new SkillDefinition(SludgeSkillsCategoryId, "pseudopodia")
	.advancementFrame("goal")
	.effectIcon("minecraft:weakness")
	.addDescription({
		"color": "gray",
		"text": "You lack a proper rigid structure for your arms, making you ineffective at archery.\n\n"
	})
	.addDescription({
		"color": "red",
		"text": "Bow projectile speed is reduced by half."
	})
	.rootSkill()
	.addAttributeReward("puffish_attributes:bow_projectile_speed", -0.5, "multiply_total")
	.serialize(SludgeDefinitionsJson)
	.toSkill("qmbylqinpxjxvjgv");





SludgeSkills.CONGEALED_1 = new SkillDefinition(SludgeSkillsCategoryId, "congealed_1")
	.advancementFrame("goal")
	.effectIcon("minecraft:health_boost")
	.addDescription({
		"color": "green",
		"text": "+10 Max Health"
	})
	.rootSkill()
	.addAttributeReward("minecraft:generic.max_health", 10.0, "addition")
	.serialize(SludgeDefinitionsJson)
	.toSkill("7mb8epyl7aobm9ub");

SludgeSkills.CONGEALED_2 = new SkillDefinition(SludgeSkillsCategoryId, "congealed_2")
	.effectIcon("minecraft:health_boost")
	.addDescription({
		"color": "green",
		"text": "+5 Max Health"
	})
	.cost(2)
	.addAttributeReward("minecraft:generic.max_health", 5.0, "addition")
	.serialize(SludgeDefinitionsJson)
	.toSkill("8r71o66i4ttue5nn");





SludgeSkills.ANTIVENOM = new SkillDefinition(SludgeSkillsCategoryId, "antivenom")
	.advancementFrame("goal")
	.effectIcon("mowziesmobs:poison_resist")
	.addDescription({
		"color": "green",
		"text": "You are immune to poison."
	})
	.rootSkill()
	.serialize(SludgeDefinitionsJson)
	.toSkill("n39u9um6nxp1haoh");

SludgeSkills.PHAGOCYTOSIS = new SkillDefinition(SludgeSkillsCategoryId, "phagocytosis")
	.itemIcon("minecraft:golden_carrot")
	.addDescription({
		"color": "green",
		"text": "You can eat food 25% faster"
	})
	.cost(1)
	.serialize(SludgeDefinitionsJson)
	.toSkill("u3dd2zdz5jy3xufx");

SludgeSkills.PHAGOCYTOSIS_2 = new SkillDefinition(SludgeSkillsCategoryId, "phagocytosis_2")
	.itemIcon("minecraft:golden_carrot")
	.addDescription({
		"color": "green",
		"text": "You can eat food 50% faster"
	})
	.cost(1)
	.serialize(SludgeDefinitionsJson)
	.toSkill("e5nab8zgkaf74j7a");

SludgeSkills.PHAGOCYTOSIS_3 = new SkillDefinition(SludgeSkillsCategoryId, "phagocytosis_3")
	.itemIcon("minecraft:golden_carrot")
	.addDescription({
		"color": "green",
		"text": "You can eat food 75% faster"
	})
	.cost(2)
	.serialize(SludgeDefinitionsJson)
	.toSkill("lky96rv3fwyg52ht");

SludgeSkills.PHAGOCYTOSIS_4 = new SkillDefinition(SludgeSkillsCategoryId, "phagocytosis_4")
	.itemIcon("minecraft:golden_carrot")
	.addDescription({
		"color": "green",
		"text": "You can eat food 100% faster"
	})
	.cost(2)
	.serialize(SludgeDefinitionsJson)
	.toSkill("mkjkbafqlvj6dsiq");