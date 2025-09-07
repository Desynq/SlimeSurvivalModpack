

class Races {
	private static readonly INSTANCES: Race[] = [];

	public static readonly HUMAN: Race = new Race("human");
	public static readonly SLUDGE: Race = new Race("sludge");

	public static getRaces() {
		return Races.INSTANCES;
	}

	public static getDefaultRace() {
		
	}
}