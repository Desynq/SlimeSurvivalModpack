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
	);

	public readonly ECHOLOCATION = this.createSkill("echolocation", def => def
		.effectIcon("slimesurvival:pinged")
		.addDescription({
			"text": "I hear you...",
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
			"text": "\n\nArmor toughness reduces damage by a flat amount rather than by percentage.",
			"color": "dark_aqua"
		})
		.addDescription({
			"text": "\nArmor reduces damage by a rational percentage.",
			"color": "dark_aqua"
		})
		.addDescription({
			"text": "\n\nMath.max(1, damage - toughness * toughnessFactor) * (armorFactor / (armor + armorFactor))",
			"color": "dark_aqua",
			"italic": true
		})
		.addDescription({
			"text": "\ntoughnessFactor = 0.5; armorFactor = 20",
			"color": "dark_aqua",
			"bold": true
		})
		.size(1.25)
		.rootSkill()
	);
})().register();