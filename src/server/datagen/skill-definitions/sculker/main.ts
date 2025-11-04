//priority: 101

const SculkerSkills = new (class extends SkillManager {
	public constructor() {
		super("slimesurvival:sculker_race");
	}

	private readonly STYLE: JsonComponentStyle = { "color": "dark_aqua", "italic": true };


	public readonly BLIND = this.createSkill("blind", def => def
		.effectIcon("minecraft:blindness")
		.addDescription({
			"text": "Who's there?",
			"color": "dark_aqua",
			"italic": true
		})
		.addDescription({
			"text": "\n\nYou cannot see living entities who aren't pinged.",
			"color": "dark_aqua"
		})
		.size(1.25)
		.rootSkill()
	);

	public readonly ECHOLOCATION = this.createSkill("echolocation", def => def
		.effectIcon("slimesurvival:pinged")
		.addDescription({
			"text": "We hear you...",
			"color": "dark_aqua",
			"italic": true
		})
		.addDescription({
			"text": "\n\nLiving entities that produce a sound event within 32 blocks of you get pinged for 1 second.",
			"color": "dark_aqua"
		})
		.size(1.25)
		.rootSkill()
	);

	public readonly CHITINOUS = this.createSkill("chitinous", def => def
		.itemIcon("minecraft:popped_chorus_fruit")
		.addDescription({
			"text": "That tickles...",
			"color": "dark_aqua",
			"italic": true
		})
		.addDescription({
			"text": "\n\nArmor is ≈25% better at reducing damage.",
		})
		.size(1.25)
		.rootSkill()
	);

	public readonly MYCELIC = this.createSkill("mycelic", def => def
		.itemIcon("minecraft:mycelium")
		.addDescription({
			"text": "The mycelium is everything — life, home, strength. Without it, we are scattered, hollow spores adrift on barren air.",
			"color": "dark_aqua",
			"italic": true
		})
		.addDescription({
			"text": "\n\nYou take double damage while not on the ground.",
			"color": "dark_aqua"
		})
		.size(1.25)
		.rootSkill()
	);

	public readonly APPRESSORIUM = this.createSkill("appressorium", def => def
		.itemIcon("minecraft:brown_mushroom")
		.addDescription({
			"text": "We are beneath you, within you, through you. Every step you take presses closer to us. When you touch the earth, we feel it — and when you fall to it, we answer.",
			"color": "dark_red",
			"italic": true
		})
		.addDescription({
			"text": "\n\nYou deal double damage to enemies who are on the ground.",
			"color": "dark_aqua"
		})
		.cost(4)
		.flagPlanned()
	);



	public readonly CHITIN_SKILLS = this.createTieredSkills("chitin", 4, (def, tier) => {
		const armor = [2, 2, 2, 2];
		const toughness = [1, 1, 1, 1];
		const cost = [1, 2, 3, 4];

		const i = tier - 1;
		const totalArmor = armor.slice(0, i + 1).reduce((acc, value) => acc + value, 0);
		const totalToughness = toughness.slice(0, i + 1).reduce((acc, value) => acc + value, 0);

		def
			.itemIcon("minecraft:red_mushroom_block")
			.addDescription({
				"text": "You naturally gain:"
					+ `\n+${totalArmor} Armor`
					+ `\n+${totalToughness} Armor Toughness`,
				"color": "dark_aqua"
			})
			.addDescription({
				"text": "\n\nPrevious chitin tiers not included",
				"color": "red"
			})
			.cost(cost[i])
			.addAttributeReward("minecraft:generic.armor", armor[i], "addition")
			.addAttributeReward("minecraft:generic.armor_toughness", toughness[i], "addition");
	});

	public readonly EXPERENTIAL = this.createSkill("experential", def => def
		.itemIcon("minecraft:experience_bottle")
		.addStyledDescription("Get your money up, and your fungi up.", this.STYLE)
		.addDescription({
			"text": "\nYou can sell experience at a 1:1 conversion rate."
		})
		.cost(1)
	);
})().register();