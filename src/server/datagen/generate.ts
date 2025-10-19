

namespace DefinitionsGenerator {

	function write(id: string, json: Object): void {
		const parts = id.split(":", 2);
		const namespace = parts[0];
		const path = parts[1];
		JsonIO.write(`kubejs/data/${namespace}/puffish_skills/categories/${path}/definitions.json`, json);
	}

	function writeFromManager(manager: RaceSkillManager): void {
		write(manager.categoryId, manager.definitionsJson);
	}

	write(SludgeSkillsCategoryId, SludgeDefinitionsJson);
	write(FARLANDER_CATEGORY_ID, FarlanderSkillDefinitionsJson);
	write(SculkerSkills.CATEGORY_ID, SculkerSkills.definitionsJson);

	RaceSkillManager.INSTANCES.forEach(manager => writeFromManager(manager));
}