// priority: 101

const SludgeSkills = new (class extends SkillManager {

	public constructor() {
		super("slimesurvival:sludge_race");
	}

	public readonly FLAMMABLE = new SkillDefinition(SludgeSkillsCategoryId, "flammable")
		.advancementFrame("goal")
		.itemIcon("minecraft:flint_and_steel")
		.addDescription({
			"color": "red",
			"text": "Fire does not extinguish naturally over time. You have to extinguish yourself in water or die trying."
		})
		.rootSkill()
		.addAttributeReward("minecraft:generic.burning_time", 2147483647, "multiply_base")
		.serialize(this.definitionsJson)
		.toSkill("s9il1r95zp4fg5vl")
		.register(this.skills);

	public readonly SLIMEPROOF = new SkillDefinition(SludgeSkillsCategoryId, "slimeproof")
		.advancementFrame("goal")
		.itemIcon("minecraft:slime_block")
		.addDescription({
			"color": "green",
			"text": "Medium-sized slimes do not hurt you."
		})
		.rootSkill()
		.serialize(this.definitionsJson)
		.toSkill("hi8bub7iluizrm0t")
		.register(this.skills);

	public readonly NATURAL_ECONOMIST = new SkillDefinition(SludgeSkillsCategoryId, "natural_economist")
		.itemIcon("minecraft:slime_ball")
		.addDescription({
			"color": "green",
			"text": "You can sell slime for double money."
		})
		.cost(1)
		.serialize(this.definitionsJson)
		.toSkill("psd4irgsit6fn85w")
		.register(this.skills);




	public readonly AREGENERATIVE = new SkillDefinition(SludgeSkillsCategoryId, "aregenerative")
		.advancementFrame("goal")
		.effectIcon("minecraft:wither")
		.addDescription({
			"color": "red",
			"text": "You do not regenerate naturally."
		})
		.rootSkill()
		.addTagReward("sludge.no_natural_regeneration")
		.serialize(this.definitionsJson)
		.toSkill("1eo7ddidgilk3911")
		.register(this.skills);






	public readonly PSEUDOPODIA = new SkillDefinition(SludgeSkillsCategoryId, "pseudopodia")
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
		.serialize(this.definitionsJson)
		.toSkill("qmbylqinpxjxvjgv")
		.register(this.skills);


	public readonly MOTION_1 = new SkillDefinition(SludgeSkillsCategoryId, "motion_1")
		.effectIcon("minecraft:strength")
		.addDescription({
			"color": "green",
			"text": "Each successful critical attack increases attack damage by 2.5% of your max health."
				+ "\n\nEffect ends when a non-critical attack is made or you stop dealing damage for more than 2 seconds."
		})
		.cost(1)
		.serializeIntoSkill(this.definitionsJson)
		.register(this.skills);

	public readonly MOTION_2 = new SkillDefinition(SludgeSkillsCategoryId, "motion_2")
		.effectIcon("minecraft:strength")
		.addDescription({
			"color": "green",
			"text": "Each successful critical attack now increases attack damage by 5% of your max health."
		})
		.cost(2)
		.serializeIntoSkill(this.definitionsJson)
		.register(this.skills);

	public readonly MOTION_3 = new SkillDefinition(SludgeSkillsCategoryId, "motion_3")
		.effectIcon("minecraft:strength")
		.addDescription({
			"color": "green",
			"text": "Each successful critical attack now increases attack damage by 10% of your max health."
		})
		.cost(4)
		.serializeIntoSkill(this.definitionsJson)
		.register(this.skills);

	public readonly MOTION_4 = new SkillDefinition(SludgeSkillsCategoryId, "motion_4")
		.effectIcon("minecraft:strength")
		.addDescription([{
			"color": "green",
			"text": "Each successful critical attack now increases attack damage by 20% of your max health"
		}, {
			"color": "red",
			"text": "\n- Motion stack duration is halved (e.g., 40 ticks -> 20 ticks)."
		}])
		.cost(4)
		.serializeIntoSkill(this.definitionsJson)
		.register(this.skills);

	public readonly INERTIA = new SkillDefinition(SludgeSkillsCategoryId, "inertia")
		.effectIcon("minecraft:absorption")
		.addDescription({
			"color": "green",
			"text": "Taking damage resets your motion timer."
		})
		.cost(2)
		.serializeIntoSkill(this.definitionsJson)
		.register(this.skills);





	public readonly CONGEALED_1 = new SkillDefinition(SludgeSkillsCategoryId, "congealed_1")
		.advancementFrame("goal")
		.effectIcon("minecraft:health_boost")
		.addDescription({
			"color": "green",
			"text": "+10 Max Health"
		})
		.rootSkill()
		.addAttributeReward("minecraft:generic.max_health", 10.0, "addition")
		.serialize(this.definitionsJson)
		.toSkill("7mb8epyl7aobm9ub")
		.register(this.skills);

	public readonly CONGEALED_2 = new SkillDefinition(SludgeSkillsCategoryId, "congealed_2")
		.effectIcon("minecraft:health_boost")
		.addDescription({
			"color": "green",
			"text": "+10 Max Health"
		})
		.cost(2)
		.addAttributeReward("minecraft:generic.max_health", 10.0, "addition")
		.serialize(this.definitionsJson)
		.toSkill("8r71o66i4ttue5nn")
		.register(this.skills);

	public readonly CONGEALED_3 = new SkillDefinition(SludgeSkillsCategoryId, "congealed_3")
		.effectIcon("minecraft:health_boost")
		.addDescription({
			"color": "green",
			"text": "+10 Max Health"
		})
		.cost(2)
		.addAttributeReward("minecraft:generic.max_health", 10.0, "addition")
		.serializeIntoSkill(this.definitionsJson)
		.register(this.skills);


	public readonly CYTOPLASM_1 = new SkillDefinition(SludgeSkillsCategoryId, "cytoplasm_1")
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
		.serializeIntoSkill(this.definitionsJson)
		.register(this.skills);

	public readonly CYTOPLASM_2 = new SkillDefinition(SludgeSkillsCategoryId, "cytoplasm_2")
		.effectIcon("minecraft:resistance")
		.addDescription([{
			"color": "green",
			"text": "Gain Resistance II when at max health."
		}, {
			"color": "red",
			"text": "\n-25% movement speed while at max health."
		}])
		.cost(2)
		.serializeIntoSkill(this.definitionsJson)
		.register(this.skills);

	public readonly CYTOPLASM_3 = new SkillDefinition(SludgeSkillsCategoryId, "cytoplasm_3")
		.effectIcon("minecraft:resistance")
		.addDescription([{
			"color": "green",
			"text": "Gain Resistance III when at max health."
		}, {
			"color": "red",
			"text": "\n-50% movement speed while at max health."
		}])
		.cost(3)
		.serializeIntoSkill(this.definitionsJson)
		.register(this.skills);

	public readonly CYTOPLASM_4 = new SkillDefinition(SludgeSkillsCategoryId, "cytoplasm_4")
		.effectIcon("minecraft:resistance")
		.addDescription([{
			"color": "green",
			"text": "Gain Resistance IV when at max health."
		}, {
			"color": "red",
			"text": "\n-100% movement speed while at max health."
		}])
		.cost(4)
		.serializeIntoSkill(this.definitionsJson)
		.register(this.skills);

	public readonly CYTOSKELETON = new SkillDefinition(SludgeSkillsCategoryId, "cytoskeleton")
		.itemIcon("mutantmonsters:mutant_skeleton_rib_cage")
		.addDescription({
			"color": "green",
			"text": "No movement slowdown from being at max health."
		})
		.cost(8)
		.serializeIntoSkill(this.definitionsJson)
		.register(this.skills);





	public readonly ANTIVENOM = new SkillDefinition(SludgeSkillsCategoryId, "antivenom")
		.advancementFrame("goal")
		.effectIcon("mowziesmobs:poison_resist")
		.addDescription({
			"color": "green",
			"text": "You are immune to poison."
		})
		.rootSkill()
		.serialize(this.definitionsJson)
		.toSkill("n39u9um6nxp1haoh")
		.register(this.skills);

	public readonly TOXIC = new SkillDefinition(SludgeSkillsCategoryId, "toxic")
		.effectIcon("minecraft:poison")
		.addDescription({
			"color": "green",
			"text": "Enemies within your attack range receive Poison I for 5 seconds when they damage you."
		})
		.cost(1)
		.serializeIntoSkill(this.definitionsJson)
		.register(this.skills);

	public readonly LETHAL_TOXIN_1 = new SkillDefinition(SludgeSkillsCategoryId, "lethal_toxin_1")
		.itemIcon("minecraft:glowstone_dust")
		.addDescription({
			"color": "green",
			"text": "Poison II, ×1/2 duration."
		})
		.cost(1)
		.serializeIntoSkill(this.definitionsJson)
		.register(this.skills);

	public readonly LETHAL_TOXIN_2 = new SkillDefinition(SludgeSkillsCategoryId, "lethal_toxin_2")
		.itemIcon("minecraft:glowstone_dust")
		.addDescription({
			"color": "green",
			"text": "Poison III, ×1/3 duration."
		})
		.cost(2)
		.serializeIntoSkill(this.definitionsJson)
		.register(this.skills);

	public readonly LETHAL_TOXIN_3 = new SkillDefinition(SludgeSkillsCategoryId, "lethal_toxin_3")
		.itemIcon("minecraft:glowstone_dust")
		.addDescription({
			"color": "green",
			"text": "Poison IV, ×1/4 duration."
		})
		.cost(3)
		.serializeIntoSkill(this.definitionsJson)
		.register(this.skills);

	public readonly LONG_LASTING_TOXIN_1 = new SkillDefinition(SludgeSkillsCategoryId, "long_lasting_toxin_1")
		.itemIcon("minecraft:redstone")
		.addDescription({
			"color": "green",
			"text": "×2 duration."
		})
		.cost(1)
		.serializeIntoSkill(this.definitionsJson)
		.register(this.skills);

	public readonly LONG_LASTING_TOXIN_2 = new SkillDefinition(SludgeSkillsCategoryId, "long_lasting_toxin_2")
		.itemIcon("minecraft:redstone")
		.addDescription({
			"color": "green",
			"text": "×4 duration."
		})
		.cost(2)
		.serializeIntoSkill(this.definitionsJson)
		.register(this.skills);

	public readonly LONG_LASTING_TOXIN_3 = new SkillDefinition(SludgeSkillsCategoryId, "long_lasting_toxin_3")
		.itemIcon("minecraft:redstone")
		.addDescription({
			"color": "green",
			"text": "×8 duration."
		})
		.cost(3)
		.serializeIntoSkill(this.definitionsJson)
		.register(this.skills);

	public readonly PHAGOCYTOSIS = new SkillDefinition(SludgeSkillsCategoryId, "phagocytosis")
		.itemIcon("minecraft:golden_carrot")
		.addDescription({
			"color": "green",
			"text": "You can eat food 25% faster"
		})
		.cost(1)
		.serialize(this.definitionsJson)
		.toSkill("u3dd2zdz5jy3xufx")
		.register(this.skills);

	public readonly PHAGOCYTOSIS_2 = new SkillDefinition(SludgeSkillsCategoryId, "phagocytosis_2")
		.itemIcon("minecraft:golden_carrot")
		.addDescription({
			"color": "green",
			"text": "You can eat food 50% faster"
		})
		.cost(1)
		.serialize(this.definitionsJson)
		.toSkill("e5nab8zgkaf74j7a")
		.register(this.skills);

	public readonly PHAGOCYTOSIS_3 = new SkillDefinition(SludgeSkillsCategoryId, "phagocytosis_3")
		.itemIcon("minecraft:golden_carrot")
		.addDescription({
			"color": "green",
			"text": "You can eat food 75% faster"
		})
		.cost(2)
		.serialize(this.definitionsJson)
		.toSkill("lky96rv3fwyg52ht")
		.register(this.skills);

	public readonly PHAGOCYTOSIS_4 = new SkillDefinition(SludgeSkillsCategoryId, "phagocytosis_4")
		.itemIcon("minecraft:golden_carrot")
		.addDescription({
			"color": "green",
			"text": "You can eat food 100% faster"
		})
		.cost(2)
		.serialize(this.definitionsJson)
		.toSkill("mkjkbafqlvj6dsiq")
		.register(this.skills);

	public readonly MITOSIS = new SkillDefinition(SludgeSkillsCategoryId, "mitosis")
		.effectIcon("minecraft:regeneration")
		.addDescription({
			"color": "aqua",
			"text": "Passively regenerate 1 health every 5 seconds at the cost of 1 hunger point."
		})
		.cost(1)
		.serialize(this.definitionsJson)
		.toSkill("cdw1xwwww7rsxbvx")
		.register(this.skills);

	public readonly APOPTOSIS = new SkillDefinition(SludgeSkillsCategoryId, "apoptosis")
		.effectIcon("minecraft:hunger")
		.addDescription({
			"color": "dark_red",
			"text": "Mitosis now works until starvation.\n-50% hunger drain per mitosis tick."
		})
		.cost(2)
		.serialize(this.definitionsJson)
		.toSkill("4yjkeqmp04gygc04")
		.register(this.skills);

	public readonly MITOTIC_ACCELERATION_1 = new SkillDefinition(SludgeSkillsCategoryId, "mitotic_acceleration_1")
		.itemIcon("minecraft:clock")
		.addDescription({
			"color": "aqua",
			"text": "Mitosis now occurs every 4 seconds."
		})
		.cost(1)
		.serialize(this.definitionsJson)
		.toSkill("xj64dsjei37hvgax")
		.register(this.skills);

	public readonly MITOTIC_ACCELERATION_2 = new SkillDefinition(SludgeSkillsCategoryId, "mitotic_acceleration_2")
		.itemIcon("minecraft:clock")
		.addDescription({
			"color": "aqua",
			"text": "Mitosis now occurs every 3 seconds."
		})
		.cost(2)
		.serialize(this.definitionsJson)
		.toSkill("lsce7nkfd76wytmm")
		.register(this.skills);

	public readonly MITOTIC_ACCELERATION_3 = new SkillDefinition(SludgeSkillsCategoryId, "mitotic_acceleration_3")
		.itemIcon("minecraft:clock")
		.addDescription({
			"color": "aqua",
			"text": "Mitosis now occurs every 2 seconds."
		})
		.cost(3)
		.serialize(this.definitionsJson)
		.toSkill("64ckkk2rx7hfvkqq")
		.register(this.skills);

	public readonly MITOTIC_ACCELERATION_4 = new SkillDefinition(SludgeSkillsCategoryId, "mitotic_acceleration_4")
		.itemIcon("minecraft:clock")
		.addDescription({
			"color": "aqua",
			"text": "Mitosis now occurs every second."
		})
		.cost(4)
		.serialize(this.definitionsJson)
		.toSkill("y2fpcywmblqtu859")
		.register(this.skills);








	public readonly CONTINUITY = this.createSkill("continuity", def => def
		.itemIcon("minecraft:golden_sword")
		.addDescription({
			"color": "green",
			"text": "Motion stacks no longer reset when doing normal attacks."
		})
		.cost(4)
	);

	public readonly WITHERING = this.createSkill("withering", def => def
		.effectIcon("minecraft:wither")
		.addDescription({
			"color": "dark_gray",
			"text": "Toxic inflicts wither instead of poison."
		})
		.cost(2)
		.requiredSkills(1)
	);

	public readonly STICKY = this.createSkill("sticky", def => def
		.effectIcon("minecraft:slowness")
		.addDescription({
			"color": "dark_gray",
			"text": "Toxic now also inflicts Slowness using the same duration and amplifier stats."
		})
		.cost(4)
	);

	public readonly SLIMEPROOF_2 = this.createSkill("slimeproof_2", def => def
		.itemIcon("minecraft:slime_block")
		.addDescription({
			"color": "green",
			"text": "Large slimes no longer hurt you either."
		})
		.cost(1)
	);

	public readonly MASS = this.createSkill("mass", def => def
		.itemIcon("minecraft:anvil")
		.addDescription({
			"text": "Gain 1 extra tick towards the max duration of your Motion decay timer per extra health point above 40."
				+ "\nOnly takes into account current health, not max health. No cap.",
			"color": "green"
		})
		.cost(4)
	);
})().register();