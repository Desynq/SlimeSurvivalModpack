/**
 * @param {ServerPlayer_} player 
 */
function DunestriderPlayer(player) {
	if (!PlayerRaceHelper.isRace(player, Races.DUNESTRIDER)) {
		throw new Error(`${player.username} is not a dunestrider.`);
	}
	this.player = player;
}