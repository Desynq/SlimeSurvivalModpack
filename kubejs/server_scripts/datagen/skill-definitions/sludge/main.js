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

SludgeSkills.AREGENERATIVE = new SkillDefinition(SludgeSkillsCategoryId, "aregenerative")
	.advancementFrame("goal")
	.effectIcon("minecraft:wither")
	.addDescription({
		"color": "red",
		"text": "You do not regenerate naturally through saturation."
	})
	.rootSkill()
	.addTagReward("no_natural_regeneration")
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