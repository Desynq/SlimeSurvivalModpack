// priority: 1

interface SkillsEntryJson {
	definition: string;
	x: number;
	y: number;
	root: boolean;
}

namespace SkillsFileIO {

	const skillsJsons: Record<string, Record<string, SkillsEntryJson> | undefined> = {};

	/**
	 * 
	 * @param categoryId ex: `slimesurvival:sludge`
	 * @param definitionId ex: `health`
	 */
	export function getSkillsFromDefinition(categoryId: string, definitionId: string): Skill[] {
		const { namespace, path } = SkillHelper.splitCategoryId(categoryId);

		const json = skillsJsons[categoryId] ??= deserializeSkillJson(namespace, path);

		const entries = Object.entries(json) as [string, SkillsEntryJson][];
		const skills: Skill[] = [];
		for (const [skillId, skillEntryJson] of entries) {
			const definition = skillEntryJson["definition"];
			if (definition !== definitionId) continue;

			const skill = new Skill(categoryId, skillId);
			skills.push(skill);
		}
		return skills;
	}

	function deserializeSkillJson(namespace: string, path: string): Record<string, SkillsEntryJson> {
		const raw = JsonIO.read(`kubejs/data/${namespace}/puffish_skills/categories/${path}/skills.json`);
		const json = ObjectHelper.fromEntries(Object.entries(raw)) as Record<string, SkillsEntryJson>;
		return json;
	}
}