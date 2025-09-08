const PlayerRaceHelper = {}

/**
 * @param {Player} player 
 */
PlayerRaceHelper.getRace = function (player) {
	const raceId = player.persistentData.getString("race");
	const race = Races.fromId(raceId) ?? Races.getDefaultRace();
	return race;
}

/**
 * @param {Player} player 
 */
PlayerRaceHelper.hasRace = function (player) {
	const race = this.getRace(player);
	return race !== undefined && race !== Races.getDefaultRace();
}

/**
 * 
 * @param {Player} player 
 * @param {Race} race 
 */
PlayerRaceHelper.setRace = function (player, race) {
	player.persistentData.putString("race", race.getRaceId());
	new RaceChangeEvent(player, race);
}

/**
 * @param {Player} player 
 * @param {Race} currentRace
 */
PlayerRaceHelper.canSwitchRaceFrom = function (player, currentRace) {
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
 */
PlayerRaceHelper.chooseRace = function (player, chosenRace) {
	const currentRace = this.getRace(player);
	let canSwitch = this.canSwitchRaceFrom(player, currentRace);
	if (!canSwitch.allowed) {
		player.tell(canSwitch.reason);
		return;
	}
	if (currentRace === chosenRace) {
		player.tell(Text.red("You already are this race"));
		return;
	}

	player.tell(Text.green(`You are now a ${chosenRace.getRaceId()}`));
	this.setRace(player, chosenRace);
}