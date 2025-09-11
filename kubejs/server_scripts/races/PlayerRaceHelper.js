const PlayerRaceHelper = {}

/**
 * @param {Player} player 
 */
PlayerRaceHelper.getRace = function(player) {
	const raceId = player.server.persistentData.getCompound("player_races").getString(player.stringUUID);
	const race = Races.fromId(raceId) ?? Races.defaultRace();
	return race;
}

/**
 * 
 * @param {Player} player 
 * @param {Race} race 
 */
PlayerRaceHelper.setRace = function(player, race) {
	ServerDataHelper.modifyCompoundTag(player.server, "player_races", (map) => {
		map.putString(player.stringUUID, race.getRaceId())
	});
	new RaceChangeEvent(player, race);
}

/**
 * 
 * @param {Player} player 
 * @param {Race} race 
 */
PlayerRaceHelper.isRace = function(player, race) {
	return this.getRace(player) === race;
}

/**
 * @param {Player} player 
 */
PlayerRaceHelper.hasRace = function(player) {
	const race = this.getRace(player);
	return race !== undefined && race !== Races.defaultRace();
}

/**
 * @param {Player} player 
 * @param {Race} currentRace
 * @returns {RaceSwitchResult}
 */
PlayerRaceHelper.canSwitchRaceFrom = function(player, currentRace) {
	if (!PlayerHelper.isOperator(player) && currentRace !== Races.defaultRace()) {
		return { success: false, code: "CANNOT_SWITCH_RACE" }
	}
	return { success: true, code: "SUCCESS" }
}

/**
 * @typedef {Object} RaceSwitchResult
 * @property {boolean} success
 * @property {"CANNOT_SWITCH_RACE" | "ALREADY_THIS_RACE" | "SUCCESS"} code
 */

/**
 * Checks to see whether the player can change their race and emits side effects
 * @param {Player} player 
 * @param {Race} chosenRace 
 * @param {boolean?} setByOperator
 * @returns {RaceSwitchResult}
 */
PlayerRaceHelper.chooseRace = function(player, chosenRace, setByOperator) {
	const currentRace = this.getRace(player);
	let canSwitch = this.canSwitchRaceFrom(player, currentRace);
	if (!setByOperator && !canSwitch.success) {
		return canSwitch;
	}
	if (currentRace === chosenRace) {
		return { success: false, code: "ALREADY_THIS_RACE" }
	}

	this.setRace(player, chosenRace);
	return { success: true, code: "SUCCESS" }
}