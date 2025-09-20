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

ChimeraSkills.PACK_MARATHON = new SkillDefinition(CHIMERA_CATEGORY_ID, "pack_marathon")
	.effectIcon("minecraft:speed")
	.advancementFrame("task")
	.addDescription({
		"color": "gray",
		"text": "Double the movement speed of your pets when sprinting."
	})
	.cost(1)
	.serialize(ChimeraSkillDefinitionsJson)
	.toSkill("g6wrs6zee7l57gnv");

ChimeraSkills.FORTITUDE_1 = new SkillDefinition(CHIMERA_CATEGORY_ID, "fortitude_1")
	.effectIcon("minecraft:resistance")
	.advancementFrame("task")
	.addDescription({
		"color": "gray",
		"text": "Tamed animals get Resistance I when your health is >= 50%"
	})
	.cost(1)
	.serialize(ChimeraSkillDefinitionsJson)
	.toSkill("454dhe0xb7uzqvlx");

ChimeraSkills.FORTITUDE_2 = new SkillDefinition(CHIMERA_CATEGORY_ID, "fortitude_2")
	.effectIcon("minecraft:resistance")
	.advancementFrame("task")
	.addDescription({
		"color": "gray",
		"text": "Tamed animals get Resistance II when your health is >= 50%"
	})
	.cost(2)
	.serialize(ChimeraSkillDefinitionsJson)
	.toSkill("l8aprgz05mqjajqh");

ChimeraSkills.FORTITUDE_3 = new SkillDefinition(CHIMERA_CATEGORY_ID, "fortitude_3")
	.effectIcon("minecraft:resistance")
	.advancementFrame("task")
	.addDescription({
		"color": "gray",
		"text": "Tamed animals get Resistance III when your health is >= 50%"
	})
	.cost(4)
	.serialize(ChimeraSkillDefinitionsJson)
	.toSkill("gcnl216n2wo0b8u5");

ChimeraSkills.SANGUINE_COVENANT = new SkillDefinition(CHIMERA_CATEGORY_ID, "sanguine_covenant")
	.effectIcon("minecraft:instant_damage")
	.advancementFrame("challenge")
	.addDescription([
		{
			"color": "gray",
			"text": "Pressing ["
		},
		{
			"color": "yellow",
			"keybind": "key.slimesurvival.primary_ability"
		},
		{
			"color": "gray",
			"text": "] makes pets following not able to get damaged below your current health percentage"
				+ "\n\n- Lasts for 15 seconds."
				+ "\n- Can be cancelled early by pressing the keybind again."
				+ "\n- Also gets cancelled early if you die."
				+ "\n- Has a cooldown of 60 seconds that starts once the ability ends."
		}
	])
	.cost(4)
	.serialize(ChimeraSkillDefinitionsJson)
	.toSkill("53sa7a8z55jcy314")