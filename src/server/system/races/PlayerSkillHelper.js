const PlayerRaceSkillHelper = {};


/**
 * 
 * @param {Player_} player 
 * @param {Race} excludedRace 
 */
PlayerRaceSkillHelper.eraseRaceSkillCategories = function(player, excludedRace) {
	for (const race of Races.getRaces()) {
		player.server.runCommandSilent(`puffish_skills category erase ${player.username} ${race.getSkillCategoryId()}`);
	}
};

/**
 * 
 * @param {Player_} player 
 * @param {Race} race 
 */
PlayerRaceSkillHelper.unlockDefaultRaceSkills = function(player, race) {
	const defaultSkills = RaceSkills.getDefaultFrom(race);
	defaultSkills.forEach(skill => {
		PlayerRaceSkillHelper.unlockSkill(player, race.getSkillCategoryId(), skill);
	});
};

/**
 * 
 * @param {Player_} player 
 * @param {string} categoryId 
 */
PlayerRaceSkillHelper.unlockCategory = function(player, categoryId) {
	player.server.runCommandSilent(`puffish_skills category unlock ${player.username} ${categoryId}`);
};

/**
 * 
 * @param {Player_} player 
 * @param {string} categoryId
 * @param {Skill} skill 
 */
PlayerRaceSkillHelper.unlockSkill = function(player, categoryId, skill) {
	CommandHelper.runCommandSilent(player.server, `puffish_skills skills unlock ${player.username} ${categoryId} ${skill.getSkillId()}`);
};

/**
 * 
 * @param {ServerPlayer_} player 
 * @param {integer} amount 
 */
PlayerRaceSkillHelper.addSkillPoint = function(player, amount) {
	const race = RaceHelper.getRace(player);
	CommandHelper.runCommandSilent(player.server, `puffish_skills experience add ${player.username} ${race.getSkillCategoryId()} ${amount}`);
}