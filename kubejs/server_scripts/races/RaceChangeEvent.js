
/**
 * @param {Player} player 
 * @param {Race} race 
 */
function RaceChangeEvent(player, race) {
	this.player = player;
	this.race = race;

	PlayerRaceSkillHelper.eraseOtherRaceSkillCategories(player, race);
	PlayerRaceSkillHelper.unlockCategory(player, race.getSkillCategoryId());
	PlayerRaceSkillHelper.unlockDefaultRaceSkills(player, race);
}