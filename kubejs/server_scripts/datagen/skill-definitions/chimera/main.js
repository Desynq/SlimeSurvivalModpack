//priority: 101

const ChimeraSkillDefinitionsJson = {};

const CHIMERA_CATEGORY_ID = "slimesurvival:chimera_race";
const ChimeraSkills = {};

ChimeraSkills.THE_LIONS_SHARE = new SkillDefinition(CHIMERA_CATEGORY_ID, "the_lions_share")
	.title("The Lion's Share")
	.itemIcon("minecraft:ocelot_spawn_egg")
	.advancementFrame("goal")
	.addDescription({
		"color": "gold",
		"text": "Owned living entities will have at least the same max health as you."
	})
	.rootSkill()
	.serialize(ChimeraSkillDefinitionsJson)
	.toSkill("p9wcqr8os2f6lncd");

ChimeraSkills.WOLF_PACKING = new SkillDefinition(CHIMERA_CATEGORY_ID, "wolf_packing")
	.itemIcon("minecraft:bone")
	.advancementFrame("task")
	.addDescription({
		"color": "gray",
		"text": "Each pet wolf you own that is following you (not sitting) increases your max health by 1 point."
			+ "\n\nCaps out at 20 pet wolves following you."
	})
	.cost(2)
	.serialize(ChimeraSkillDefinitionsJson)
	.toSkill("l3j9ppm6hiiypz3l");