

namespace DefinitionsGenerator {

	function write(id: string, json: Object): void {
		const parts = id.split(":", 2);
		const namespace = parts[0];
		const path = parts[1];
		JsonIO.write(`kubejs/data/${namespace}/puffish_skills/categories/${path}/definitions.json`, json);
	}

	function writeFromManager(manager: SkillManager): void {
		write(manager.categoryId, manager.definitionsJson);
	}

	SkillManager.INSTANCES.forEach(manager => writeFromManager(manager));
}