
/**
 * 
 * @param {ServerPlayer_} player 
 */
function FarlanderPlayer(player) {
	if (!RaceHelper.isRace(player, Races.FARLANDER)) {
		throw new Error(`${player.username} is not a farlander.`);
	}
	this.player = player;
}