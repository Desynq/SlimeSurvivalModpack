
const RaceSkills = (function() {
	/**
	 * @param {Race} race
	 */
	function getFrom(race) {
		switch (race) {
			case Races.FARLANDER:
				return FarlanderSkills.skills;
			case Races.SLUDGE:
				return Object.values(SludgeSkills);
			case Races.CHIMERA:
				return Object.values(ChimeraSkills);
			case Races.DUNESTRIDER:
				return Object.values(DunestriderSkills);
			default:
				return [];
		}
	}

	/**
	 * 
	 * @param {Race} race 
	 */
	function getDefaultFrom(race) {
		return getFrom(race).filter(skill => skill.isDefault());
	}

	return {
		getFrom: getFrom,
		getDefaultFrom: getDefaultFrom
	}
})();