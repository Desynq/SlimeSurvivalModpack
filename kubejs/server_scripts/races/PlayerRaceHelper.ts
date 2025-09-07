
class PlayerRaceHelper {

	public static getRace(player: import("net.minecraft.world.entity.player.Player").$Player$$Original) {
		const race: string = player.persistentData.getString("race");
		return Object.values(Races).includes(race) ? race : Races.HUMAN;
	}

	public static hasRace(player: import("net.minecraft.world.entity.player.Player").$Player$$Original) {
		return this.getRace(player) != Races.HUMAN;
	}

	public static setRace(player: import("net.minecraft.world.entity.player.Player").$Player$$Original, race: string) {
		if (!Object.values(Races).includes(race)) {
			throw new RaceError("Race not found in Races!");
		}

		player.persistentData.putString("race", race);
		new RaceChangeEvent(player, race);
	}

	public static chooseRace(player: import("net.minecraft.world.entity.player.Player").$Player$$Original, race: string) {
		const currentRace = this.getRace(player);

	}
}