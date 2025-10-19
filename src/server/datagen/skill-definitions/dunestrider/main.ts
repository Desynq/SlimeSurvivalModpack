//priority: 101


// IVE DECIDED RANDOMS RACE IS GONNA DO BURST DAMAGE + EXTRA DAMAGE TO LOWER HP ENEMIES
// AS WELL AS SHREDDING SOME RESISTANCES
// I CANT DECIPHER UR FRAMEWORK COMPLETELY COMPLETE IT FOR ME TOMORROW KEK
// BUT DONT TOUCH THE SKILLS IM GONNA CODE THEM JUST MAKE THE PUFFISH WORK PLZ
// ALSO RENAME IT TO SOMETHING MORE THEMATIC. RANDOM DGAF SO NOWS YOUR TIME TO SHINE

const DunestriderSkills = new (class extends RaceSkillManager {

	public constructor() {
		super("slimesurvival:dunestrider_race");
	}

	public readonly REND_1 = new SkillDefinition(this.categoryId, "rend_1")
		.itemIcon("minecraft:cracked_stone_bricks")
		.advancementFrame("goal")
		.addDescription({
			"color": "red",
			"text": "You have a knack for chipping armour.\n\n- Plus 20% Armor shred for 1.5s"
		})
		.rootSkill()
		.serialize(this.definitionsJson)
		.toSkill("9f2xq7v6b1p4z8rw");

	public readonly REND_2 = new SkillDefinition(this.categoryId, "rend_2")
		.itemIcon("minecraft:cracked_stone_bricks")
		.advancementFrame("task")
		.addDescription({
			"color": "red",
			"text": "You're deft at sundering armor.\n\n- Plus 40% Armor shred for 1.5s"
		})
		.cost(2)
		.serialize(this.definitionsJson)
		.toSkill("3f9xq2v7b6p4z8rw");

	public readonly REND_3 = new SkillDefinition(this.categoryId, "rend_3")
		.itemIcon("minecraft:cracked_stone_bricks")
		.advancementFrame("task")
		.addDescription({
			"color": "red",
			"text": "You shred armor.\n\n- Plus 60% Armor shred for 1.5s"
		})
		.cost(3)
		.serialize(this.definitionsJson)
		.toSkill("8v4xq1b7n2p6z3yt");

	public readonly REND_4 = new SkillDefinition(this.categoryId, "rend_4")
		.itemIcon("minecraft:cracked_deepslate_bricks")
		.advancementFrame("task")
		.addDescription({
			"color": "dark_red",
			"text": "Armor buckles at your name.\n\n- 80% Armor shred for 1.5s"
		})
		.cost(4)
		.serialize(this.definitionsJson)
		.toSkill("7f2xq9v5b3p8z6lm");

	public readonly REND_5 = new SkillDefinition(this.categoryId, "rend_5")
		.itemIcon("minecraft:cracked_nether_bricks")
		.advancementFrame("task")
		.addDescription({
			"color": "dark_red",
			"text": "You tear through all.\n\n- 100% Armor shred for 1.5s"
		})
		.cost(5)
		.serialize(this.definitionsJson)
		.toSkill("6b3xq8v2n1p7z4qs");

	public readonly TREAD = new SkillDefinition(this.categoryId, "tread")
		.itemIcon("minecraft:leather_boots")
		.advancementFrame("task")
		.addDescription({
			"color": "yellow",
			"text": "You skate across the landscape easier than most.\n\n- Plus 0.5 step height"
		})
		.addAttributeReward('minecraft:generic.step_height', .5, "addition")
		.cost(1)
		.serialize(this.definitionsJson)
		.toSkill("5p7xq4v6b9p2z8dj");

	public readonly DEFT = new SkillDefinition(this.categoryId, "deft")
		.itemIcon("minecraft:sand")
		.advancementFrame("task")
		.addDescription({
			"color": "yellow",
			"text": "Adaption for the nomadic lifestyle of the Sinking Dunes.\n\n- Extra speed on sand.\nBlocks like soul sand don't slow you as much."
		})
		.addAttributeReward('minecraft:generic.movement_efficiency', 20, "addition")
		.cost(1)
		.serialize(this.definitionsJson)
		.toSkill("w8k3z1v6b9p2x7qm");

	public readonly LIGHT_FOOTED = new SkillDefinition(this.categoryId, "light_footed")
		.itemIcon("minecraft:wind_charge")
		.advancementFrame("task")
		.addDescription({
			"color": "yellow",
			"text": "Eat or be eaten, hit or get hit. Keep out of reach.\n\n- Your rolls recharge twice as fast."
		})
		.addAttributeReward('combat_roll:recharge', 20, "addition")
		.cost(2)
		.serialize(this.definitionsJson)
		.toSkill("x7F9kLm2Qw8VzR1T");

	public readonly DEMEAN_1 = new SkillDefinition(this.categoryId, "demean_1")
		.itemIcon("minecraft:netherite_sword")
		.advancementFrame("task")
		.addDescription({
			"color": "red",
			"text": "The prideful gait of the powerful disgusts you."
				+ "\n\nYour damage logarithmically scales in relation to the victim's current health versus your max health."
				+ "\n\nFactor of 0.25"
		})
		.cost(1)
		.serialize(this.definitionsJson)
		.toSkill("2n8xq5v3b1p6z7wh");

	public readonly DEMEAN_2 = new SkillDefinition(this.categoryId, "demean_2")
		.itemIcon("minecraft:netherite_sword")
		.advancementFrame("task")
		.addDescription({
			"color": "red",
			"text": "Stripping people of their ego is your specialty.\n\n- Factor is now 0.5"
		})
		.cost(2)
		.serialize(this.definitionsJson)
		.toSkill("4k7xp2v9b3n6z1qy");

	public readonly DEMEAN_3 = new SkillDefinition(this.categoryId, "demean_3")
		.itemIcon("minecraft:netherite_sword")
		.advancementFrame("task")
		.addDescription({
			"color": "dark_red",
			"text": "Durability is a metric to be measured against you. Gloryseekers fear you hearing their name.\n\n- Factor is now 1.0"
		})
		.cost(4)
		.serialize(this.definitionsJson)
		.toSkill("1m8xq6v4b2p9z5wt");

	public readonly MARTYR = new SkillDefinition(this.categoryId, "martyr")
		.itemIcon("cataclysm:blazing_grips")
		.addDescription({
			"color": "red",
			"text": "You will not be taken advantage of by the powerful."
				+ "\n\nDemean now ratios your current health instead of your max health."
		})
		.cost(4)
		.serializeIntoSkill(this.definitionsJson);


	public readonly HYSTERIA_1 = new SkillDefinition(this.categoryId, "hysteria_1")
		.itemIcon("mowziesmobs:umvuthana_mask_fury")
		.advancementFrame("task")
		.addDescription({
			"color": "yellow",
			"text": "When things look rough, you feel lucky.\n\n- Gain movement speed per enemy targeting you.\n(Capped at 2x base speed)"
		})
		.cost(1)
		.serialize(this.definitionsJson)
		.toSkill("9b2xq7v5c4m8z1pl");

	public readonly HYSTERIA_2 = new SkillDefinition(this.categoryId, "hysteria_2")
		.itemIcon("mowziesmobs:umvuthana_mask_fury")
		.advancementFrame("task")
		.addDescription({
			"color": "yellow",
			"text": "Intense battle is your homestead.\n\n- Gain movement speed and attack speed per enemy targeting you.\n(Capped at 2x base speed)"
		})
		.cost(2)
		.serialize(this.definitionsJson)
		.toSkill("q7v2b9x4p6z1m8rp");

	public readonly HYSTERIA_3 = new SkillDefinition(this.categoryId, "hysteria_3")
		.itemIcon("mowziesmobs:umvuthana_mask_fury")
		.advancementFrame("task")
		.addDescription({
			"color": "gold",
			"text": "You hunger for war.\n\n- Gain movement speed and attack speed per enemy targeting you.\nFill 1 saturation on kill when at max speed.\n(Capped at 2x base speed)"
		})
		.cost(4)
		.serialize(this.definitionsJson)
		.toSkill("f3n6x8v2b1p7z4qs");

	public readonly BLITZKREIG = new SkillDefinition(this.categoryId, "blitzkreig")
		.itemIcon("cataclysm:burning_ashes")
		.advancementFrame("task")
		.addDescription({
			"color": "yellow",
			"text": "Swift and decisive.\n\n- Deal up to 2x damage based on how fast you're moving."
		})
		.cost(4)
		.serialize(this.definitionsJson)
		.toSkill("f3n6x8v2b1p7z4qs");

	public readonly ROBINHOOD = new SkillDefinition(this.categoryId, "robinhood")
		.itemIcon("minecraft:barrier")
		.advancementFrame("goal")
		.addDescription({
			"color": "green",
			"text": "Take from the strong, give to the weak!\n\n- You deal 50% less damage to enemies with significantly less health than you."
		})
		.rootSkill()
		.serialize(this.definitionsJson)
		.toSkill("a7f2xq9v5b3p8z6a");

	public readonly SCAVENGER = new SkillDefinition(this.categoryId, "scavenger")
		.itemIcon("minecraft:rotten_flesh")
		.advancementFrame("goal")
		.addDescription({
			"color": "green",
			"text": "Survivals not easy in the Dunes.\n\n- Sell certain mob drops for more."
		})
		.rootSkill()
		.serialize(this.definitionsJson)
		.toSkill("rab5481jrf51h598");

	public readonly MOMENTUM = new SkillDefinition(this.categoryId, "momentum")
		.itemIcon("minecraft:string")
		.advancementFrame("goal")
		.addDescription({
			"color": "gray",
			"text": "Me? Stopped in my tracks?..\n\n- When struck by an enemy that you haven't damaged in the last 30 seconds, take 2x damage and gain slowness I"
		})
		.rootSkill()
		.serialize(this.definitionsJson)
		.toSkill("v8czm1qxdu3lke9r");

	public readonly FIRST_STRIKE = new SkillDefinition(this.categoryId, "first_strike")
		.itemIcon("minecraft:cobweb")
		.advancementFrame("task")
		.addDescription({
			"color": "gray",
			"text": "Victory goes to the swift.\n\n- Deal increased damage for a small burst after damaging an enemy for the first time.\n(30s cooldown)"
		})
		.cost(2)
		.serialize(this.definitionsJson)
		.toSkill("t5bnqz7lwxr3umke");

	public readonly HEAVENLY_RESTRICTION = new SkillDefinition(this.categoryId, "heavenly_restriction")
		.itemIcon("minecraft:chain")
		.advancementFrame("task")
		.addDescription({
			"color": "white",
			"text": "Make a pact with the war god in return for knowledge of true power.\n\n- You lose all natural regeneration. Pain is virtue."
		})
		.cost(1)
		.requiredSkills(3)
		.addTagReward("no_natural_regeneration")
		.serialize(this.definitionsJson)
		.toSkill("od48m4hf7r9le2mv");

	public readonly FURANTUR_1 = new SkillDefinition(this.categoryId, "furantur_1")
		.itemIcon("minecraft:redstone")
		.advancementFrame("task")
		.addDescription({
			"color": "dark_red",
			"text": "Soak in the blood.\n\n- Gain 2.5% lifesteal on-hit."
		})
		.cost(2)
		.serialize(this.definitionsJson)
		.toSkill("idFW1923jf01l3o6");

	public readonly FURANTUR_2 = new SkillDefinition(this.categoryId, "furantur_2")
		.itemIcon("minecraft:redstone")
		.advancementFrame("task")
		.addDescription({
			"color": "dark_red",
			"text": "You hemorrhage your foes and relish it.\n\n- Gain 5.0% lifesteal on-hit."
		})
		.cost(3)
		.serialize(this.definitionsJson)
		.toSkill("g7xq2n4mdbv5czlu");

	public readonly FURANTUR_3 = new SkillDefinition(this.categoryId, "furantur_3")
		.itemIcon("minecraft:redstone")
		.advancementFrame("task")
		.addDescription({
			"color": "dark_red",
			"text": "Spread the red. You're a festival of death.\n\n- Gain 7.5% lifesteal on-hit."
		})
		.cost(4)
		.serialize(this.definitionsJson)
		.toSkill("r1kz8jwmq5tl2hce");

	public readonly FURANTUR_4 = new SkillDefinition(this.categoryId, "furantur_4")
		.itemIcon("minecraft:redstone")
		.advancementFrame("task")
		.addDescription({
			"color": "dark_red",
			"text": "Drink their blood.\n\n- Gain 10% lifesteal on-hit."
		})
		.cost(5)
		.serialize(this.definitionsJson)
		.toSkill("n9dfv3upxbz4eaym");

	public readonly FURANTUR_5 = new SkillDefinition(this.categoryId, "furantur_5")
		.title("Ares")
		.itemIcon("illagerinvasion:unusual_dust")
		.advancementFrame("challenge")
		.addDescription({
			"color": "dark_red",
			"text": "Something inside of you needs violence.\nYou don't dare disobey.\n\n- Heal for 20% of your enemies max hp on kill.\n15% lifesteal on-hit."
		})
		.cost(10)
		.serialize(this.definitionsJson)
		.toSkill("l2mpxq7wrn0cegti");

	public readonly BLOODCLOT_1 = new SkillDefinition(this.categoryId, "bloodclot_1")
		.itemIcon("minecraft:beetroot_soup")
		.addDescription({
			"text": "Overheal up to your max health in absorption hearts from lifesteal.",
			"color": "dark_red"
		})
		.cost(4)
		.serialize(this.definitionsJson)
		.findSkill();

})().register();







// also use: https://puffish.net/skillsmod/editor/
