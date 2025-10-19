// priority: 1000


abstract class RaceSkillManager {

	public static readonly INSTANCES: RaceSkillManager[] = [];

	public readonly definitionsJson: Object = {};
	public readonly skills: Skill[] = [];

	public constructor(
		public readonly categoryId: string
	) {
		RaceSkillManager.INSTANCES.push(this);
	}

	protected createSkill(id: string, decorate: (def: SkillDefinition) => void): Skill {
		const def = new SkillDefinition(this.categoryId, id);
		decorate(def);
		return def.serializeIntoSkill(this.definitionsJson).register(this.skills);
	}
}