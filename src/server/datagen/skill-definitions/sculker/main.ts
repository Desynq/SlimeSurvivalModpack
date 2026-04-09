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

	public readonly CHITINOUS = this.createDataSkill("chitinous", {
		armorFactor: 15
	}, (def, data) => {
		const calc = (a: number, b: number): string => StringHelper.toPercent(1 - b / (a + b), 1);
		def
			.itemIcon("minecraft:popped_chorus_fruit")
			.addDescription({
				"text": "That tickles...",
				"color": "dark_aqua",
				"italic": true
			})
			.addDescription({
				"text": "\n\nArmor is better at reducing damage."
					+ [5, 10, 15, 20, 30, 40].map(a => `\n* ${a} = -${calc(a, data.armorFactor)}% vs -${calc(a, 20)}%`).join(""),
				"color": "green"
			})
			.size(1.25)
			.rootSkill();
	});

	public readonly MYCELIC = this.createSkill("mycelic", def => def
		.itemIcon("minecraft:mycelium")
		.addDescription({
			"text": "The mycelium is everything — life, home, strength. Without it, we are scattered, hollow spores adrift on barren air.",
			"color": "dark_aqua",
			"italic": true
		})
		.addDescription({
			"text": "\n\nYou take double damage while not on the ground.",
			"color": "dark_red"
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
	);



	public readonly CHITIN_SKILLS = this.createTieredSkills("chitin", 5, (def, tier) => {
		const armor = [2, 2, 2, 2, 2];
		const toughness = [1, 1, 1, 1, 1];
		const cost = [1, 2, 3, 4, 5];
		const icons = ["leather", "chainmail", "iron", "diamond", "netherite"]
			.map(id => id + "_chestplate");

		const i = tier - 1;
		const totalArmor = armor.slice(0, i + 1).reduce((acc, value) => acc + value, 0);
		const totalToughness = toughness.slice(0, i + 1).reduce((acc, value) => acc + value, 0);

		def
			.itemIcon(icons[i])
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


	public readonly ROOTING = this.createSkill("rooting", def => def
		.itemIcon("twilightforest:liveroot")
		.addStyledDescription("We focus our energy beneath us.", this.STYLE)
		.addDescription({
			"text": "\n\nGain +100% Armor and +100% Armor Toughness while rooting."
				+ "\n\nRooting requires you to be crouching on the ground with nothing in your mainhand and either nothing in your offhand or a shield."
				+ "\n\nAdditionally, you cannot be holding down WASD or Jump."
		})
		.cost(4)
	);

	public readonly ROOTED = this.createSkill("rooted", def => def
		.itemIcon("twilightforest:root_strand")
		.addStyledDescription("Good luck moving us...", this.STYLE)
		.addDescription({
			"text": "\n\nGain +50% Knockback Resistance and the Rooted effect while rooting."
		})
		.cost(2)
	);

	public readonly QUICKROOT = this.createSkill("quickroot", def => def
		.itemIcon("minecraft:sugar")
		.addStyledDescription("Part of us will move, the other part, not so much...", this.STYLE)
		.addDescription({
			"text": "\n\nRooting now can activate with any item in your mainhand or offhand (Quickrooting)."
				+ "\n\nQuickrooting won't grant armor toughness nor proc Rooted."
		})
		.cost(4)
	);

	public readonly GRAPPLE = this.createSkill("grapple", def => def
		.effectIcon("cataclysm:stun")
		.addStyledDescription("Found you!", this.STYLE)
		.addDescription({
			"text": "\n\nWhen attacking an unpinged enemy, they become stunned for 1 second and pinged for 3 seconds."
		})
		.cost(2)
		.flagPlanned()
	);

	public readonly LEER = this.createSkill("leer", def => def
		.itemIcon("cataclysm:cursed_eye")
		.addStyledDescription("We see you...", this.STYLE)
		.addDescription({
			"text": "\n\nPinged enemies glow."
		})
		.cost(1)
	);

	public readonly ECHO_SKILLS = this.createTieredDataSkills("echo", [
		{ ticks: 40, cost: 1 },
		{ ticks: 60, cost: 2 },
		{ ticks: 80, cost: 2 }
	], (def, tier, data) => {
		const seconds: string = StringHelper.upToFixed(data.ticks / 20, 2);
		def.itemIcon("minecraft:echo_shard")
			.addStyledDescription("Good luck hiding...", this.STYLE)
			.addDescription({
				"text": `\n\nEcholocation now pings enemies for ${seconds} seconds`
			})
			.cost(data.cost);
	});

	public readonly AUTOTROPH = this.createSkill("autotroph", def => def
		.itemIcon("farmersdelight:organic_compost")
		.addStyledDescription("We eat what others cannot eat.", this.STYLE)
		.addDescription({
			"text": "\n\nImmune to Hunger I"
		})
		.cost(1)
		.flagPlanned()
	);

	public readonly HYPERTROPHY = this.createSkill("hypertrophy", def => def
		.itemIcon("farmersdelight:mushroom_rice")
		.addStyledDescription("We eating good tonight", this.STYLE)
		.addDescription({
			"text": "\n\nGain one point of armor toughness for every two points of saturation when at full hunger."
		})
		.cost(2)
		.flagPlanned()
	);

	public readonly ROOTSTEP = this.createSkill("rootstep", def => def
		.itemIcon("createdeco:zinc_catwalk_stairs")
		.addStyledDescription("We climb slowly, never leaving the ground.", this.STYLE)
		.addDescription({
			"text": "\n\nStep height increases by 0.5 while actively crouching"
		})
		.cost(1)
	);

	public readonly ROOTFALL = this.createDataSkill("rootfall", {
		maxFallDist: 1,
		graceTicks: 5,
		nourishmentRecoveryTicks: 40
	}, (def, data) => def
		.itemIcon("minecraft:feather")
		.addStyledDescription("We stay connected even through small falls.", this.STYLE)
		.addDescription({
			"text": `\n\nStill counted as being on the ground as long as you haven't fallen further than ${StringHelper.formatUnit(data.maxFallDist, "block")}`
				+ ` or stayed off the ground for more than ${StringHelper.toSeconds(data.graceTicks)}.`
				+ "\n\nOnly affects Nourishment and Mycelic."
		})
		.addDescription({
			"text": `\n\nNourishment takes ${StringHelper.toSeconds(data.nourishmentRecoveryTicks)} longer to activate`,
			"color": "dark_red"
		})
		.cost(2)
	);

	public readonly NOURISHMENT = this.createDataSkill("nourishment", {
		recovery: 60
	}, (def, data) => def
		.effectIcon("farmersdelight:nourishment")
		.addStyledDescription("Brother, we crave nitrogen.", this.STYLE)
		.addDescription([
			{
				"text": "\n\nGain Nourishment effect when standing on a sculkable block."
			},
			{
				"text": `\n\nTakes ${StringHelper.toSeconds(data.recovery)} to activate.`
			}
		])
		.cost(2)
	);

	public readonly EN_ROOT = this.createSkill("en_root", def => def
		.itemIcon("farmersdelight:kelp_roll_slice")
		.addStyledDescription("We be rolling", this.STYLE)
		.addDescription({
			"text": "\n\nCombat rolls recover twice as fast when nourished."
		})
		.cost(1)
		.flagPlanned()
	);

	public readonly DENSE = this.createDataSkill("dense", {
		k: 40
	}, (def, data) => {
		const falloff = (armor: number): string => {
			const percent = MathHelper.rationalFalloff(armor, data.k);
			return `${armor} = -${StringHelper.toPercent(1 - percent, 3)}%`;
		};
		def
			.itemIcon("minecraft:shroomlight")
			.addStyledDescription("We're tough to crack, slow to move.", this.STYLE)
			.addDescription({
				"text": "\n\nEach point of armor toughness reduces damage by 1.0 instead of 0.5.",
				"color": "green"
			})
			.addDescription({
				"text": "\n\nArmor decreases movement speed."
					+ [10, 20, 30, 40].map(a => `\n* ${falloff(a)}`).join(""),
				"color": "dark_red"
			})
			.cost(2)
			.flagPlanned();
	});

	public readonly FUNGAL_EXPANSION = this.createDataSkill("fungal_expansion", {
		radius: 32
	}, (def, data) => {
		def.itemIcon("twilightforest:minoshroom_trophy")
			.title({
				text: "Fungal Expansion",
				color: "gold",
				bold: true
			})
			.addStyledDescription("Throughout Agartha and Earth, We alone are fungal.", this.STYLE)
			.addDescription({
				"text": "\n\nPressing"
			})
			.addKeybindDescription("key.slimesurvival.tertiary_ability")
			.addDescription({
				"text": "will activate an area of effect field around the user."
			})
			.addDescription({
				"text": `\n\nAbility requires full hunger in order to activate.`
					+ `\n\nAbility will remain active until hunger falls below 6.`
					+ `\n\nUser and all players within field will gain Hunger II, and Darkness.`
					+ `\n\nAll living entities except for the user will be pinged within the field.`
					+ `\n\nDefault radius: ${data.radius} blocks.`
			})
			.cost(4)
			.flagPlanned();
	});
})().register();