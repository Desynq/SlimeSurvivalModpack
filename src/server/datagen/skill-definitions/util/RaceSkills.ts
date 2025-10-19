// priority: 1000


abstract class RaceSkillManager {

	public readonly definitionsJson: Object = {};
	public readonly skills: Skill[] = [];

	public constructor(
		public readonly CATEGORY_ID: string
	) { }

	protected createSkill(id: string, decorate: (def: SkillDefinition) => void): Skill {
		const def = new SkillDefinition(this.CATEGORY_ID, id);
		decorate(def);
		return def.serializeIntoSkill(this.definitionsJson).register(this.skills);
	}
}