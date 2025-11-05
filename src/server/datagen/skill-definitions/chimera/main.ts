//priority: 101
const ChimeraSkills = new (class extends SkillManager {
	public constructor() {
		super("slimesurvival:chimera_race");
	}

	private readonly SNAKE_STYLE: JsonComponentStyle = { "color": "dark_green", "italic": true };

	public readonly THE_LIONS_SHARE = new SkillDefinition(this.categoryId, "the_lions_share")
		.title("The Lion's Share")
		.itemIcon("minecraft:ocelot_spawn_egg")
		.advancementFrame("goal")
		.addDescription({
			"color": "gold",
			"text": "Owned living entities will have at least the same max health as you.\n\nEffects you get also spread to your followers."
		})
		.rootSkill()
		.serialize(this.definitionsJson)
		.toSkill("p9wcqr8os2f6lncd")
		.register(this.skills);



	public readonly WOLF_PACKING = new SkillDefinition(this.categoryId, "wolf_packing")
		.itemIcon("minecraft:bone")
		.advancementFrame("task")
		.addDescription({
			"color": "gray",
			"text": "Each pet wolf you own that is following you (not sitting) increases your max health by 1 point."
				+ "\n\nCaps out at 20 pet wolves following you."
		})
		.cost(2)
		.serialize(this.definitionsJson)
		.toSkill("l3j9ppm6hiiypz3l")
		.register(this.skills);

	public readonly PACK_MARATHON = new SkillDefinition(this.categoryId, "pack_marathon")
		.effectIcon("minecraft:speed")
		.advancementFrame("task")
		.addDescription({
			"color": "gray",
			"text": "Double the movement speed of your pets when sprinting."
		})
		.cost(1)
		.serialize(this.definitionsJson)
		.toSkill("g6wrs6zee7l57gnv")
		.register(this.skills);

	public readonly FORTITUDE_1 = new SkillDefinition(this.categoryId, "fortitude_1")
		.effectIcon("minecraft:resistance")
		.advancementFrame("task")
		.addDescription({
			"color": "gray",
			"text": "Tamed animals get Resistance I when your health is >= 50%"
		})
		.cost(1)
		.serialize(this.definitionsJson)
		.toSkill("454dhe0xb7uzqvlx")
		.register(this.skills);

	public readonly FORTITUDE_2 = new SkillDefinition(this.categoryId, "fortitude_2")
		.effectIcon("minecraft:resistance")
		.advancementFrame("task")
		.addDescription({
			"color": "gray",
			"text": "Tamed animals get Resistance II when your health is >= 50%"
		})
		.cost(2)
		.serialize(this.definitionsJson)
		.toSkill("l8aprgz05mqjajqh")
		.register(this.skills);

	public readonly FORTITUDE_3 = new SkillDefinition(this.categoryId, "fortitude_3")
		.effectIcon("minecraft:resistance")
		.advancementFrame("task")
		.addDescription({
			"color": "gray",
			"text": "Tamed animals get Resistance III when your health is >= 50%"
		})
		.cost(4)
		.serialize(this.definitionsJson)
		.toSkill("gcnl216n2wo0b8u5")
		.register(this.skills);

	public readonly SANGUINE_COVENANT = new SkillDefinition(this.categoryId, "sanguine_covenant")
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
		.serialize(this.definitionsJson)
		.toSkill("53sa7a8z55jcy314")
		.register(this.skills);

	public readonly COVENANT_RESTORATION = new SkillDefinition(this.categoryId, "covenant_restoration")
		.effectIcon("minecraft:instant_health")
		.advancementFrame("task")
		.addDescription({
			"color": "green",
			"text": "All pets following you are restored to your current health percentage once Sanguine Convenant gets cancelled or ends."
		})
		.cost(2)
		.serialize(this.definitionsJson)
		.toSkill("mdxmlh3ln8lruyo2")
		.register(this.skills);

	public readonly PERFECT_COVENANT = new SkillDefinition(this.categoryId, "perfect_covenant")
		.itemIcon("minecraft:diamond")
		.advancementFrame("task")
		.addDescription({
			"color": "green",
			"text": "Cooldown is reduced by 50% if the ability ends and you're at max health.\n- Does not proc if the ability is cancelled early."
		})
		.cost(1)
		.serialize(this.definitionsJson)
		.toSkill("i9m0vussyk8rd1fn")
		.register(this.skills);

	public readonly FALL_PROTECTION = new SkillDefinition(this.categoryId, "fall_protection")
		.itemIcon("minecraft:feather")
		.advancementFrame("task")
		.addDescription({
			"color": "green",
			"text": "Pets following you don't take fall damage"
		})
		.cost(1)
		.serialize(this.definitionsJson)
		.toSkill("hzdfphadlqrhhv7a")
		.register(this.skills);



	public readonly TOXOPHILITE = this.createSkill("toxophilite", def => def
		.itemIcon("minecraft:bow")
		.addDescription({
			"text": "Attribute points spent towards attack damage instead increase projectile damage."
		})
		.rootSkill()
	);

	public readonly PIERCE = this.createSkill("pierce", def => def
		.itemIcon("twilightforest:block_and_chain")
		.addDescription({
			"text": "Drawing your bow back for twice as long as a full charge makes the fired arrow partially ignore armor."
				+ "\n\n• 50% of damage reduced by armor and armor toughness is brought back"
		})
		.cost(2)
	);

	public readonly BALLET = this.createSkill("ballet", def => def
		.itemIcon("create_connected:crank_wheel")
		.addDescription({
			"text": "Your arrow does double damage if you manage at least a 360° rotation without breaking direction before firing your bow."
				+ "\n\n• Rotation starts when you first draw the bow."
				+ "\n• Changing spin direction at any point resets accumulated rotation."
				+ "\n• Accumulated rotation can still reset even after hitting the 360° threshold"
		})
		.cost(2)
	);

	public readonly DROPSHOT = this.createSkill("dropshot", def => def
		.itemIcon("minecraft:feather")
		.addDescription({
			"text": "Your arrow does double damage if you fire your bow while falling."
		})
		.cost(2)
	);
})().register();