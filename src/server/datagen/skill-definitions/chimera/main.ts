//priority: 101
const ChimeraSkills = new (class extends SkillManager {
	public constructor() {
		super("slimesurvival:chimera_race");
	}

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
})().register();