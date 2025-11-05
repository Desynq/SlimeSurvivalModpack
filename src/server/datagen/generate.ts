// priority: 2

namespace SkillsFileGenerator {

	function write(id: string, json: Object): void {
		const { namespace, path } = SkillHelper.splitCategoryId(id);
		JsonIO.write(`kubejs/data/${namespace}/puffish_skills/categories/${path}/definitions.json`, json);
	}

	function writeFromManager(manager: SkillManager): void {
		write(manager.categoryId, manager.definitionsJson);
	}

	SkillManager.INSTANCES.forEach(manager => writeFromManager(manager));
}