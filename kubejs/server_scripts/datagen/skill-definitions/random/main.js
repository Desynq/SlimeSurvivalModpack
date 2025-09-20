//priority: 101


// IVE DECIDED RANDOMS RACE IS GONNA DO BURST DAMAGE + EXTRA DAMAGE TO LOWER HP ENEMIES
// AS WELL AS SHREDDING SOME RESISTANCES
// I CANT DECIPHER UR FRAMEWORK COMPLETELY COMPLETE IT FOR ME TOMORROW KEK
// BUT DONT TOUCH THE SKILLS IM GONNA CODE THEM JUST MAKE THE PUFFISH WORK PLZ
// ALSO RENAME IT TO SOMETHING MORE THEMATIC. RANDOM DGAF SO NOWS YOUR TIME TO SHINE

const RandomSkillDefinitionsJson = {};

const RANDOM_CATEGORY_ID = "slimesurvival:random_race";
const RandomSkills = {};

RandomSkills.REND = new SkillDefinition(RANDOM_CATEGORY_ID, "rend")
	.itemIcon("minecraft:cracked_stone_bricks")
	.advancementFrame("goal")
	.addDescription({
		"color": "dark_red",
		"text": "Your swings tear armour asunder."
	})
	.rootSkill()
	.serialize(RandomSkillDefinitionsJson)
	.toSkill("9f2xq7v6b1p4z8rw")