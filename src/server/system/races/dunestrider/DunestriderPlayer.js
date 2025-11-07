/**
 * @param {ServerPlayer_} player 
 */
function DunestriderPlayer(player) {
	if (!RaceHelper.isRace(player, Races.DUNESTRIDER)) {
		throw new Error(`${player.username} is not a dunestrider.`);
	}
	this.player = player;
}