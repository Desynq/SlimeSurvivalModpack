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
	.itemIcon("minecraft:slime_ball")
	.addDescription({
		"color": "green",
		"text": "You can sell slime for double money."
	})
	.cost(1)
	.serialize(SludgeDefinitionsJson)
	.toSkill("psd4irgsit6fn85w");




SludgeSkills.AREGENERATIVE = new SkillDefinition(SludgeSkillsCategoryId, "aregenerative")
	.advancementFrame("goal")
	.effectIcon("minecraft:wither")
	.addDescription({
		"color": "red",
		"text": "You do not regenerate naturally."
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


SludgeSkills.MOTION_1 = new SkillDefinition(SludgeSkillsCategoryId, "motion_1")
	.effectIcon("minecraft:strength")
	.addDescription({
		"color": "green",
		"text": "Each successful critical attack increases attack damage by +0.25."
			+ "\nEffect ends when a non-critical attack is made or you stop dealing damage for more than 2 seconds."
	})
	.cost(1)
	.serializeIntoSkill(SludgeDefinitionsJson);
SludgeSkills.MOTION_2 = new SkillDefinition(SludgeSkillsCategoryId, "motion_2")
	.effectIcon("minecraft:strength")
	.addDescription({
		"color": "green",
		"text": "Each successful critical attack now increases attack damage by +0.5"
	})
	.cost(2)
	.serializeIntoSkill(SludgeDefinitionsJson);
SludgeSkills.MOTION_3 = new SkillDefinition(SludgeSkillsCategoryId, "motion_3")
	.effectIcon("minecraft:strength")
	.addDescription({
		"color": "green",
		"text": "Each successful critical attack now increases attack damage by +1.0"
	})
	.cost(4)
	.serializeIntoSkill(SludgeDefinitionsJson);
SludgeSkills.MOTION_4 = new SkillDefinition(SludgeSkillsCategoryId, "motion_4")
	.effectIcon("minecraft:strength")
	.addDescription([{
		"color": "green",
		"text": "Each successful critical attack now increases attack damage by +2.0"
	}, {
		"color": "red",
		"text": "\n- Effect now ends if you stop dealing damage for more than 1 second."
	}])
	.cost(4)
	.serializeIntoSkill(SludgeDefinitionsJson);

SludgeSkills.INERTIA = new SkillDefinition(SludgeSkillsCategoryId, "inertia")
	.effectIcon("minecraft:absorption")
	.addDescription({
		"color": "green",
		"text": "Taking damage resets your motion timer."
	})
	.cost(4)
	.serializeIntoSkill(SludgeDefinitionsJson);





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
SludgeSkills.CONGEALED_3 = new SkillDefinition(SludgeSkillsCategoryId, "congealed_3")
	.effectIcon("minecraft:health_boost")
	.addDescription({
		"color": "green",
		"text": "+5 Max Health"
	})
	.cost(2)
	.addAttributeReward("minecraft:generic.max_health", 5.0, "addition")
	.serializeIntoSkill(SludgeDefinitionsJson);


SludgeSkills.CYTOPLASM_1 = new SkillDefinition(SludgeSkillsCategoryId, "cytoplasm_1")
	.effectIcon("minecraft:resistance")
	.addDescription({
		"color": "gray",
		"text": "Press"
	})
	.addKeybindDescription("key.slimesurvival.tertiary_ability")
	.addDescription([{
		"color": "gray",
		"text": "to toggle upgrade."
	}, {
		"color": "green",
		"text": "\nGain Resistance I when at max health."
	}])
	.cost(1)
	.serializeIntoSkill(SludgeDefinitionsJson);
SludgeSkills.CYTOPLASM_2 = new SkillDefinition(SludgeSkillsCategoryId, "cytoplasm_2")
	.effectIcon("minecraft:resistance")
	.addDescription([{
		"color": "green",
		"text": "Gain Resistance II when at max health."
	}, {
		"color": "red",
		"text": "\n-25% movement speed while at max health."
	}])
	.cost(2)
	.serializeIntoSkill(SludgeDefinitionsJson);
SludgeSkills.CYTOPLASM_3 = new SkillDefinition(SludgeSkillsCategoryId, "cytoplasm_3")
	.effectIcon("minecraft:resistance")
	.addDescription([{
		"color": "green",
		"text": "Gain Resistance III when at max health."
	}, {
		"color": "red",
		"text": "\n-50% movement speed while at max health."
	}])
	.cost(3)
	.serializeIntoSkill(SludgeDefinitionsJson);
SludgeSkills.CYTOPLASM_4 = new SkillDefinition(SludgeSkillsCategoryId, "cytoplasm_4")
	.effectIcon("minecraft:resistance")
	.addDescription([{
		"color": "green",
		"text": "Gain Resistance IV when at max health."
	}, {
		"color": "red",
		"text": "\n-100% movement speed while at max health."
	}])
	.cost(4)
	.serializeIntoSkill(SludgeDefinitionsJson);
SludgeSkills.CYTOSKELETON = new SkillDefinition(SludgeSkillsCategoryId, "cytoskeleton")
	.itemIcon("mutantmonsters:mutant_skeleton_rib_cage")
	.addDescription({
		"color": "green",
		"text": "No movement slowdown from being at max health."
	})
	.cost(8)
	.serializeIntoSkill(SludgeDefinitionsJson)





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

SludgeSkills.TOXIC = new SkillDefinition(SludgeSkillsCategoryId, "toxic")
	.effectIcon("minecraft:poison")
	.addDescription({
		"color": "green",
		"text": "Enemies within your attack range receive Poison I for 5 seconds when they damage you."
	})
	.cost(1)
	.serializeIntoSkill(SludgeDefinitionsJson);

SludgeSkills.LETHAL_TOXIN_1 = new SkillDefinition(SludgeSkillsCategoryId, "lethal_toxin_1")
	.itemIcon("minecraft:glowstone_dust")
	.addDescription({
		"color": "green",
		"text": "Poison II, ×1/2 duration."
	})
	.cost(1)
	.serializeIntoSkill(SludgeDefinitionsJson);
SludgeSkills.LETHAL_TOXIN_2 = new SkillDefinition(SludgeSkillsCategoryId, "lethal_toxin_2")
	.itemIcon("minecraft:glowstone_dust")
	.addDescription({
		"color": "green",
		"text": "Poison III, ×1/3 duration."
	})
	.cost(2)
	.serializeIntoSkill(SludgeDefinitionsJson);
SludgeSkills.LETHAL_TOXIN_3 = new SkillDefinition(SludgeSkillsCategoryId, "lethal_toxin_3")
	.itemIcon("minecraft:glowstone_dust")
	.addDescription({
		"color": "green",
		"text": "Poison IV, ×1/4 duration."
	})
	.cost(3)
	.serializeIntoSkill(SludgeDefinitionsJson);
SludgeSkills.LONG_LASTING_TOXIN_1 = new SkillDefinition(SludgeSkillsCategoryId, "long_lasting_toxin_1")
	.itemIcon("minecraft:redstone")
	.addDescription({
		"color": "green",
		"text": "×2 duration."
	})
	.cost(1)
	.serializeIntoSkill(SludgeDefinitionsJson);
SludgeSkills.LONG_LASTING_TOXIN_2 = new SkillDefinition(SludgeSkillsCategoryId, "long_lasting_toxin_2")
	.itemIcon("minecraft:redstone")
	.addDescription({
		"color": "green",
		"text": "×4 duration."
	})
	.cost(2)
	.serializeIntoSkill(SludgeDefinitionsJson);
SludgeSkills.LONG_LASTING_TOXIN_3 = new SkillDefinition(SludgeSkillsCategoryId, "long_lasting_toxin_3")
	.itemIcon("minecraft:redstone")
	.addDescription({
		"color": "green",
		"text": "×8 duration."
	})
	.cost(3)
	.serializeIntoSkill(SludgeDefinitionsJson);

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