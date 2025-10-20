//priority: 101

const SculkerSkills = new (class extends SkillManager {
	public constructor() {
		super("slimesurvival:sculker_race");
	}

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
		.flagPlanned()
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
		.flagPlanned()
	);

	public readonly CHITINOUS = this.createSkill("chitinous", def => def
		.itemIcon("minecraft:popped_chorus_fruit")
		.addDescription({
			"text": "That tickles...",
			"color": "dark_aqua",
			"italic": true
		})
		.addDescription({
			"text": "\n\nArmor is 33% more effective at reducing damage",
			"color": "dark_aqua"
		})
		.size(1.25)
		.rootSkill()
		.flagPlanned()
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
		.flagPlanned()
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



	private createChitinSkill(tier: number, armor: number, toughness: number, cost: number): Skill {
		return this.createSkill(`chitin_${tier}`, def => def
			.itemIcon("minecraft:red_mushroom_block")
			.addDescription({
				"text": "You naturally gain:"
					+ `\n+${armor} Armor`
					+ `\n+${toughness} Armor Toughness`,
				"color": "dark_aqua"
			})
			.cost(cost)
			.flagPlanned()
		);
	}

	public readonly CHITIN_1 = this.createChitinSkill(1, 2, 1, 1);
	public readonly CHITIN_2 = this.createChitinSkill(2, 4, 1, 2);
	public readonly CHITIN_3 = this.createChitinSkill(3, 4, 2, 3);
	public readonly CHITIN_4 = this.createChitinSkill(4, 6, 2, 4);
})().register();