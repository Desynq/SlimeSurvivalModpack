


namespace AttributePointHelper {
	const strengthSkills = SkillsFileIO.getSkillsFromDefinition("slimesurvival:example", "attack_damage");
	const dexteritySkills = SkillsFileIO.getSkillsFromDefinition("slimesurvival:example", "attack_speed");

	function getPoints(player: ServerPlayer_, skills: Skill[]): integer {
		let points = 0;
		for (const skill of skills) {
			if (skill.isUnlockedFor(player)) points++;
		}
		return points;
	}

	export function getStrengthPoints(player: ServerPlayer_): integer {
		return getPoints(player, strengthSkills);
	}

	export function getDexterityPoints(player: ServerPlayer_): integer {
		return getPoints(player, dexteritySkills);
	}
}