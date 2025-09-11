const PlayerRaceSkillHelper = {};

/**
 * @param {Player} player
 * @param {Skill} skill
 */
PlayerRaceSkillHelper.hasSkill = function(player, skill) {
	const traitId = skill.getTraitId();
	return player.tags.contains(traitId);
}


/**
 * 
 * @param {Player} player 
 * @param {Race} excludedRace 
 */
PlayerRaceSkillHelper.eraseOtherRaceSkillCategories = function(player, excludedRace) {
	Races.getRaces().filter(race => race !== excludedRace).forEach(race => {
		player.server.runCommandSilent(`puffish_skills category erase ${player.username} ${race.getSkillCategoryId()}`);
	});
}

/**
 * 
 * @param {Player} player 
 * @param {Race} race 
 */
PlayerRaceSkillHelper.unlockDefaultRaceSkills = function(player, race) {
	const defaultSkills = RaceSkills.getDefaultFrom(race);
	defaultSkills.forEach(skill => {
		PlayerRaceSkillHelper.unlockSkill(player, race.getSkillCategoryId(), skill);
	});
}

/**
 * 
 * @param {Player} player 
 * @param {string} categoryId 
 */
PlayerRaceSkillHelper.unlockCategory = function(player, categoryId) {
	player.server.runCommandSilent(`puffish_skills category unlock ${player.username} ${categoryId}`);
}

/**
 * 
 * @param {Player} player 
 * @param {string} categoryId
 * @param {Skill} skill 
 */
PlayerRaceSkillHelper.unlockSkill = function(player, categoryId, skill) {
	CommandHelper.runCommandSilent(player.server, `puffish_skills skills unlock ${player.username} ${categoryId} ${skill.getId()}`);
}