// priority: 1000


abstract class SkillManager {

	public static readonly INSTANCES: SkillManager[] = [];

	public readonly definitionsJson: Object = {};
	public readonly skills: Skill[] = [];

	public constructor(
		public readonly categoryId: string
	) { }

	protected createSkill(id: string, decorate: (def: SkillDefinition) => void): Skill {
		const def = new SkillDefinition(this.categoryId, id);
		decorate(def);
		return def.serializeIntoSkill(this.definitionsJson).register(this.skills);
	}

	protected createTieredSkills(baseId: string, tiers: integer, decorate: (def: SkillDefinition, tier: integer, prevSkills: Skill[]) => void): Skill[] {
		const skills: Skill[] = [];
		for (let tier = 1; tier <= tiers; tier++) {
			const def = new SkillDefinition(this.categoryId, `${baseId}_${tier}`);
			decorate(def, tier, skills);
			const skill = def.serializeIntoSkill(this.definitionsJson).register(this.skills);
			skills.push(skill);
		}
		return skills;
	}

	public register(): this {
		SkillManager.INSTANCES.push(this);
		return this;
	}
}