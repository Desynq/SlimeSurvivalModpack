
const Races = (function() {
	/** @type {Race[]} */
	const INSTANCES = [];

	const HUMAN = register(new Race("human", true));
	const SLUDGE = register(new Race("sludge"));
	const FARLANDER = register(new Race("farlander"));
	const CHIMERA = register(new Race("chimera"));

	function getRaces() {
		return INSTANCES;
	}

	function defaultRace() {
		const race = INSTANCES.find(race => race.isDefault());
		if (race === undefined) {
			throw new Error("No default race has been registered.");
		}
		return race;
	}

	/**
	 * @param {string} raceId 
	 */
	function fromId(raceId) {
		return INSTANCES.find(race => race.getRaceId() === raceId);
	}

	/**
	 * @param {Race} race 
	 */
	function register(race) {
		INSTANCES.push(race);
		return race;
	}

	return {
		HUMAN: HUMAN,
		SLUDGE: SLUDGE,
		FARLANDER: FARLANDER,
		CHIMERA: CHIMERA,
		getRaces: getRaces,
		defaultRace: defaultRace,
		fromId: fromId
	}
})();