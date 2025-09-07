
/**
 * 
 * @param {import("net.minecraft.world.entity.player.Player").$Player$$Original} player 
 * @param {string} race 
 */
function RaceChangeEvent(player, race) {
	this.player = player;
	this.race = race;

	this.resetSkills();
}

RaceChangeEvent.prototype.resetSkills = function() {

}