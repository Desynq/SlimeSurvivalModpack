const PlayerRaceHelper = {}

/**
 * @param {Player} player 
 */
PlayerRaceHelper.getRace = function(player) {
	const raceId = player.persistentData.getString("race");
	const race = Races.fromId(raceId) ?? Races.getDefaultRace();
	return race;
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
	return race !== undefined && race !== Races.getDefaultRace();
}

/**
 * 
 * @param {Player} player 
 * @param {Race} race 
 */
PlayerRaceHelper.setRace = function(player, race) {
	player.persistentData.putString("race", race.getRaceId());
	new RaceChangeEvent(player, race);
}

/**
 * @param {Player} player 
 * @param {Race} currentRace
 */
PlayerRaceHelper.canSwitchRaceFrom = function(player, currentRace) {
	if (!PlayerHelper.isOperator(player) && currentRace !== Races.getDefaultRace()) {
		return {
			allowed: false,
			reason: Text.red(`You must be an operator or have your race as ${Races.getDefaultRace().getRaceId()} in order to switch races`)
		};
	}
	return { allowed: true }
}

/**
 * Checks to see whether the player can change their race and emits side effects
 * @param {Player} player 
 * @param {Race} chosenRace 
 * @param {boolean?} override
 */
PlayerRaceHelper.chooseRace = function(player, chosenRace, override) {
	const currentRace = this.getRace(player);
	let canSwitch = this.canSwitchRaceFrom(player, currentRace);
	if (!override && !canSwitch.allowed) {
		return canSwitch.reason;
	}
	if (currentRace === chosenRace) {
		return Text.red("You already are this race");
	}

	this.setRace(player, chosenRace);
	return Text.green(`You are now a ${chosenRace.getRaceId()}`);
}