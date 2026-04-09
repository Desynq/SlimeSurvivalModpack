// priority: 1000


abstract class SkillManager {

	public static readonly INSTANCES: SkillManager[] = [];

	public readonly definitionsJson: Object = {};
	public readonly skills: Skill<any>[] = [];

	public constructor(
		public readonly categoryId: string
	) { }

	protected createSkill(id: string, decorate: (def: SkillDefinition) => void): Skill {
		const def = new SkillDefinition(this.categoryId, id);
		decorate(def);
		return def.serializeIntoSkill(this.definitionsJson).register(this.skills);
	}

	protected createDataSkill<const D extends SkillData>(id: string, data: D, decorate: (def: SkillDefinition, data: Readonly<D>) => void): Skill<D> {
		const def = new SkillDefinition(this.categoryId, id);
		decorate(def, data);
		return def.serializeIntoSkill(this.definitionsJson, data).register(this.skills);
	}

	protected createTieredDataSkills<const D extends readonly SkillData[]>(
		baseId: string,
		dataList: D,
		decorate: (def: SkillDefinition, tier: integer, data: D[number], prevSkills: Skill[]) => void
	): { [K in keyof D]: Skill<D[K]> } {
		const skills: Skill<any>[] = [];
		for (let tier = 1; tier <= dataList.length; tier++) {
			const def = new SkillDefinition(this.categoryId, `${baseId}_${tier}`);
			const data = dataList[tier - 1];
			decorate(def, tier, data, skills);
			const skill = def.serializeIntoSkill(this.definitionsJson, data).register(this.skills);
			skills.push(skill);
		}

		return skills as { [K in keyof D]: Skill<D[K]> };
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