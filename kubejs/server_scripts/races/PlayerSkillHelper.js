
const PlayerRaceSkillHelper = {};

/**
 * @param {Player} player
 * @param {Skill} skill
 */
PlayerRaceSkillHelper.hasSkill = function(player, skill) {
	const tagId = skill.getTagId();
	return player.tags.contains(tagId);
}