


namespace AttributePointHelper {
	const strengthSkills = SkillsFileIO.getSkillsFromDefinition("slimesurvival:example", "attack_damage");

	export function getStrengthPoints(player: ServerPlayer_): integer {
		let points = 0;
		for (const skill of strengthSkills) {
			if (skill.isUnlockedFor(player)) points++;
		}
		return points;
	}
}