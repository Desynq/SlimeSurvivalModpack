

/**
 * @param {ServerPlayer_} player 
 */
function ChimeraPlayer(player) {
	if (!PlayerRaceHelper.isRace(player, Races.CHIMERA)) {
		throw new Error(`${player.username} is not a chimera.`);
	}
	this.player = player;
}