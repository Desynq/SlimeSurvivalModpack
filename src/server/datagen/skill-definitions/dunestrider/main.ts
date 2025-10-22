//priority: 101


// IVE DECIDED RANDOMS RACE IS GONNA DO BURST DAMAGE + EXTRA DAMAGE TO LOWER HP ENEMIES
// AS WELL AS SHREDDING SOME RESISTANCES
// I CANT DECIPHER UR FRAMEWORK COMPLETELY COMPLETE IT FOR ME TOMORROW KEK
// BUT DONT TOUCH THE SKILLS IM GONNA CODE THEM JUST MAKE THE PUFFISH WORK PLZ
// ALSO RENAME IT TO SOMETHING MORE THEMATIC. RANDOM DGAF SO NOWS YOUR TIME TO SHINE

const DunestriderSkills = new (class extends SkillManager {

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
		.toSkill("9f2xq7v6b1p4z8rw")
		.register(this.skills);

	public readonly REND_2 = new SkillDefinition(this.categoryId, "rend_2")
		.itemIcon("minecraft:cracked_stone_bricks")
		.advancementFrame("task")
		.addDescription({
			"color": "red",
			"text": "You're deft at sundering armor.\n\n- Plus 40% Armor shred for 1.5s"
		})
		.cost(2)
		.serialize(this.definitionsJson)
		.toSkill("3f9xq2v7b6p4z8rw")
		.register(this.skills);

	public readonly REND_3 = new SkillDefinition(this.categoryId, "rend_3")
		.itemIcon("minecraft:cracked_stone_bricks")
		.advancementFrame("task")
		.addDescription({
			"color": "red",
			"text": "You shred armor.\n\n- Plus 60% Armor shred for 1.5s"
		})
		.cost(3)
		.serialize(this.definitionsJson)
		.toSkill("8v4xq1b7n2p6z3yt")
		.register(this.skills);

	public readonly REND_4 = new SkillDefinition(this.categoryId, "rend_4")
		.itemIcon("minecraft:cracked_deepslate_bricks")
		.advancementFrame("task")
		.addDescription({
			"color": "dark_red",
			"text": "Armor buckles at your name.\n\n- 80% Armor shred for 1.5s"
		})
		.cost(4)
		.serialize(this.definitionsJson)
		.toSkill("7f2xq9v5b3p8z6lm")
		.register(this.skills);

	public readonly REND_5 = new SkillDefinition(this.categoryId, "rend_5")
		.itemIcon("minecraft:cracked_nether_bricks")
		.advancementFrame("task")
		.addDescription({
			"color": "dark_red",
			"text": "You tear through all.\n\n- 100% Armor shred for 1.5s"
		})
		.cost(5)
		.serialize(this.definitionsJson)
		.toSkill("6b3xq8v2n1p7z4qs")
		.register(this.skills);

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
		.toSkill("5p7xq4v6b9p2z8dj")
		.register(this.skills);

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
		.toSkill("w8k3z1v6b9p2x7qm")
		.register(this.skills);

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
		.toSkill("x7F9kLm2Qw8VzR1T")
		.register(this.skills);

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
		.toSkill("2n8xq5v3b1p6z7wh")
		.register(this.skills);

	public readonly DEMEAN_2 = new SkillDefinition(this.categoryId, "demean_2")
		.itemIcon("minecraft:netherite_sword")
		.advancementFrame("task")
		.addDescription({
			"color": "red",
			"text": "Stripping people of their ego is your specialty.\n\n- Factor is now 0.5"
		})
		.cost(2)
		.serialize(this.definitionsJson)
		.toSkill("4k7xp2v9b3n6z1qy")
		.register(this.skills);

	public readonly DEMEAN_3 = new SkillDefinition(this.categoryId, "demean_3")
		.itemIcon("minecraft:netherite_sword")
		.advancementFrame("task")
		.addDescription({
			"color": "dark_red",
			"text": "Durability is a metric to be measured against you. Gloryseekers fear you hearing their name.\n\n- Factor is now 1.0"
		})
		.cost(4)
		.serialize(this.definitionsJson)
		.toSkill("1m8xq6v4b2p9z5wt")
		.register(this.skills);

	public readonly MARTYR = new SkillDefinition(this.categoryId, "martyr")
		.itemIcon("cataclysm:blazing_grips")
		.addDescription({
			"color": "red",
			"text": "You will not be taken advantage of by the powerful."
				+ "\n\nDemean now ratios your current health instead of your max health."
		})
		.cost(4)
		.serializeIntoSkill(this.definitionsJson)
		.register(this.skills);


	public readonly HYSTERIA_1 = new SkillDefinition(this.categoryId, "hysteria_1")
		.itemIcon("mowziesmobs:umvuthana_mask_fury")
		.advancementFrame("task")
		.addDescription({
			"color": "yellow",
			"text": "When things look rough, you feel lucky.\n\n- Gain movement speed per enemy targeting you.\n(Capped at 2x base speed)"
		})
		.cost(1)
		.serialize(this.definitionsJson)
		.toSkill("9b2xq7v5c4m8z1pl")
		.register(this.skills);

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
		.toSkill("f3n6x8v2b1p7z4qs")
		.register(this.skills);

	public readonly BLITZKREIG = new SkillDefinition(this.categoryId, "blitzkreig")
		.itemIcon("cataclysm:burning_ashes")
		.advancementFrame("task")
		.addDescription({
			"color": "yellow",
			"text": "Swift and decisive.\n\n- Deal up to 2x damage based on how fast you're moving."
		})
		.cost(4)
		.serialize(this.definitionsJson)
		.toSkill("f3n6x8v2b1p7z4qs")
		.register(this.skills);

	public readonly ROBINHOOD = new SkillDefinition(this.categoryId, "robinhood")
		.itemIcon("minecraft:barrier")
		.advancementFrame("goal")
		.addDescription({
			"color": "green",
			"text": "Take from the strong, give to the weak!\n\n- You deal 50% less damage to enemies with significantly less health than you."
		})
		.rootSkill()
		.serialize(this.definitionsJson)
		.toSkill("a7f2xq9v5b3p8z6a")
		.register(this.skills);

	public readonly SCAVENGER = new SkillDefinition(this.categoryId, "scavenger")
		.itemIcon("minecraft:rotten_flesh")
		.advancementFrame("goal")
		.addDescription({
			"color": "green",
			"text": "Survivals not easy in the Dunes.\n\n- Sell certain mob drops for more."
		})
		.rootSkill()
		.serialize(this.definitionsJson)
		.toSkill("rab5481jrf51h598")
		.register(this.skills);

	public readonly MOMENTUM = new SkillDefinition(this.categoryId, "momentum")
		.itemIcon("minecraft:string")
		.advancementFrame("goal")
		.addDescription({
			"color": "gray",
			"text": "Me? Stopped in my tracks?..\n\n- When struck by an enemy that you haven't damaged in the last 30 seconds, take 2x damage and gain slowness I"
		})
		.rootSkill()
		.serialize(this.definitionsJson)
		.toSkill("v8czm1qxdu3lke9r")
		.register(this.skills);

	public readonly FIRST_STRIKE = new SkillDefinition(this.categoryId, "first_strike")
		.itemIcon("minecraft:cobweb")
		.advancementFrame("task")
		.addDescription({
			"color": "gray",
			"text": "Victory goes to the swift.\n\n- Deal increased damage for a small burst after damaging an enemy for the first time.\n(30s cooldown)"
		})
		.cost(2)
		.serialize(this.definitionsJson)
		.toSkill("t5bnqz7lwxr3umke")
		.register(this.skills);

	public readonly HEAVENLY_RESTRICTION = new SkillDefinition(this.categoryId, "heavenly_restriction")
		.itemIcon("minecraft:chain")
		.advancementFrame("task")
		.addDescription({
			"color": "white",
			"text": "Make a pact with the war god in return for knowledge of true power.\n\n- You lose all natural regeneration. Pain is virtue."
		})
		.cost(1)
		.requiredSkills(2)
		.addTagReward("no_natural_regeneration")
		.serialize(this.definitionsJson)
		.toSkill("od48m4hf7r9le2mv")
		.register(this.skills);

	public readonly FURANTUR_1 = new SkillDefinition(this.categoryId, "furantur_1")
		.itemIcon("minecraft:redstone")
		.advancementFrame("task")
		.addDescription({
			"color": "dark_red",
			"text": "Soak in the blood.\n\n- Gain 2.5% lifesteal on-hit."
		})
		.cost(2)
		.serialize(this.definitionsJson)
		.toSkill("idFW1923jf01l3o6")
		.register(this.skills);

	public readonly FURANTUR_2 = new SkillDefinition(this.categoryId, "furantur_2")
		.itemIcon("minecraft:redstone")
		.advancementFrame("task")
		.addDescription({
			"color": "dark_red",
			"text": "You hemorrhage your foes and relish it.\n\n- Gain 5.0% lifesteal on-hit."
		})
		.cost(3)
		.serialize(this.definitionsJson)
		.toSkill("g7xq2n4mdbv5czlu")
		.register(this.skills);

	public readonly FURANTUR_3 = new SkillDefinition(this.categoryId, "furantur_3")
		.itemIcon("minecraft:redstone")
		.advancementFrame("task")
		.addDescription({
			"color": "dark_red",
			"text": "Spread the red. You're a festival of death.\n\n- Gain 7.5% lifesteal on-hit."
		})
		.cost(4)
		.serialize(this.definitionsJson)
		.toSkill("r1kz8jwmq5tl2hce")
		.register(this.skills);

	public readonly FURANTUR_4 = new SkillDefinition(this.categoryId, "furantur_4")
		.itemIcon("minecraft:redstone")
		.advancementFrame("task")
		.addDescription({
			"color": "dark_red",
			"text": "Drink their blood.\n\n- Gain 10% lifesteal on-hit."
		})
		.cost(5)
		.serialize(this.definitionsJson)
		.toSkill("n9dfv3upxbz4eaym")
		.register(this.skills);

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
		.toSkill("l2mpxq7wrn0cegti")
		.register(this.skills);

	public readonly BLOODCLOT_1 = new SkillDefinition(this.categoryId, "bloodclot_1")
		.itemIcon("minecraft:beetroot_soup")
		.addDescription(["",
			{
				"text": "The taste of your enemies' blood keeps you running.",
				"color": "dark_red",
				"italic": true
			},
			{
				"text": "\n\nOverheal up to half your max health in absorption hearts from lifesteal."
					+ "\nLifesteal will prioritize maxing out normal health before overhealing."
					+ "\nOverheal decays at 1hp/s.",
			}
		])
		.cost(2)
		.serialize(this.definitionsJson)
		.findSkill()
		.register(this.skills);

	public readonly BLOODCLOT_2 = this.createSkill("bloodclot_2", def => def
		.itemIcon("minecraft:beetroot_soup")
		.addDescription({
			"text": "Your lust for vengeance knows no bounds.",
			"color": "dark_red",
			"italic": true
		})
		.addDescription({
			"text": "\n\n+100% Max Overheal"
		})
		.cost(4)
		.flagPlanned()
	);

	public readonly PRIMACY = this.createSkill("primacy", def => def
		.itemIcon("minecraft:netherite_upgrade_smithing_template")
		.addDescription({
			"text": "The world heals too quickly. Scars must linger, pain must speak — only through excess and unrest can justice breathe again.",
			"color": "dark_red",
			"italic": true
		})
		.addDescription({
			"text": "\n\nLifesteal prioritizes maxing out overheal before healing actual health.",
		})
		.cost(4)
		.flagPlanned()
	);

	public readonly HEMORRHAGE = this.createSkill("hemorrhage", def => def
		.effectIcon("minecraft:health_boost")
		.addDescription({
			"text": "Dominion does not wait for patient hands. Justice is ephemeral. Best to take it now when the opportunity is ripe.",
			"color": "dark_red",
			"italic": true
		})
		.addDescription({
			"text": "\n\nYou can surge overheal (overheal with no cap) as long as the lifesteal amount is greater than current total overheal."
		})
		.cost(8)
		.flagPlanned()
	);



	public readonly RESONANCE = this.createSkill("resonance", def => def
		.effectIcon("minecraft:darkness")
		.addDescription({
			"text": "No lives wasted.",
			"color": "dark_red",
			"italic": true
		})
		.addDescription({
			"text": "\n\nDamage left over after killing an enemy goes to the damage you deal to the next enemy."
				+ "\n• Decays after 5 seconds."
		})
		.cost(6)
		.flagPlanned()
	);


	/* -------------------------------------------------------------------------- */
	/*                             Focus Skill Branch                             */
	/* -------------------------------------------------------------------------- */
	public readonly FOCUS = this.createSkill("focus", def => def
		.itemIcon("mowziesmobs:sol_visage")
		.advancementFrame("challenge")
		.addDescription(["",
			{
				"text": "Use every moment of respite to spot their weaknesses and patterns.",
				"color": "dark_red",
				"italic": true
			},
			{
				"text": "\n\nPressing"
			}
		])
		.addKeybindDescription("key.slimesurvival.primary_ability")
		.addDescription(["",
			{
				"text": "will activate Focus."
					+ "\n• 30s cooldown"
					+ "\n• 1s charge-up time for ability to activate"
					+ "\n• 5s duration"

					+ "\n\nWhile the ability is active or charging up:"
					+ "\n• Focus will deactivate if you take damage, attack, or fully use or stop using any item."

					+ "\n\nWhile the ability is active:"
					+ "\n• Hysteria and Momentum will not proc."
					+ "\n• Normal attacks will always deal critical damage."
			}
		])
		.cost(1)
	);

	public readonly DEFLECTION = this.createSkill("deflection", def => def
		.itemIcon("minecraft:shield")
		.addDescription(["",
			{
				"text": "You think those puny arrows do anything to me?",
				"color": "dark_red",
				"italic": true
			},
			{
				"text": "\n\nWhile Focus is active:\nProjectiles are automatically parried and ignored."
			}
		])
		.cost(2)
		.flagPlanned()
	);

	public readonly PARRIED = this.createSkill("parried", def => def
		.itemIcon("minecraft:iron_sword")
		.addDescription(["",
			{
				"text": "You're a fool if you think I didn't see that coming.",
				"color": "dark_red",
				"italic": true
			},
			{
				"text": "\n\n  You now parry the attack that deactivated your Focus ability after it fully charged, taking no damage from it and stunning your opponent for 2 seconds."
					+ "\n  Must be an immediate attack."
			}
		])
		.cost(4)
		.flagPlanned()
	);

	public readonly CLARITY = this.createSkill("clarity", def => def
		.itemIcon("minecraft:glass")
		.addDescription(["",
			{
				"text": "I said no distractions.",
				"color": "dark_red",
				"italic": true
			},
			{
				"text": "\n\nAll negative effects are removed while Focus is active."
			}
		])
		.cost(3)
		.flagPlanned()
	);

	public readonly CLAIRVOYANCE = this.createSkill("clairvoyance", def => def
		.effectIcon("minecraft:glowing")
		.addDescription(["",
			{
				"text": "Justice is blind, I am not.",
				"color": "dark_red",
				"italic": true
			},
			{
				"text": "\n\nWhile Focus is active:\nAll enemies currently targeting you gain glowing."
			}
		])
		.cost(1)
		.flagPlanned()
	);

	public readonly DISCONCERN = this.createSkill("disconcern", def => def
		.itemIcon("twilightforest:naga_courtyard_miniature_structure")
		.addDescription(["",
			{
				"text": "Does this concern you?",
				"color": "dark_red",
				"italic": true
			},
			{
				"text": "\n\nWhile Focus is active:\nIgnore damage sources that aren't caused by a mob targeting you or a player."
			}
		])
		.cost(4)
		.flagPlanned()
	);

	public readonly SOLITUDE = this.createSkill("solitude", def => def
		.itemIcon("minecraft:iron_bars")
		.addDescription(["",
			{
				"text": "Finally, some peace and quiet.",
				"color": "dark_red",
				"italic": true
			},
			{
				"text": "\n\nFocus duration lasts twice as long when there are no other players within 32 blocks of you."
			}
		])
		.cost(2)
		.flagPlanned()
	);

	public readonly CRITICAL = this.createSkill("critical", def => def
		.itemIcon("twilightforest:exanimate_essence")
		.addDescription({
			"text": "Others laze around while you put the effort in even when not needed. That ends now.",
			"color": "dark_red",
			"italic": true
		})
		.addDescription({
			"text": "\n\nWhile Focus is active:"
				+ "\n• Vanilla critical attacks deal 2.0x damage instead of 1.5x damage."
		})
		.cost(6)
		.flagPlanned()
	);

})().register();



// also use: https://puffish.net/skillsmod/editor/
