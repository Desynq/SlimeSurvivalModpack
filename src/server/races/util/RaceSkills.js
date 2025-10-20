
const RaceSkills = (function() {
	/**
	 * @param {Race} race
	 */
	function getFrom(race) {
		switch (race) {
			case Races.FARLANDER:
				return FarlanderSkills.skills;
			case Races.SLUDGE:
				return SludgeSkills.skills;
			case Races.CHIMERA:
				return ChimeraSkills.skills;
			case Races.DUNESTRIDER:
				return DunestriderSkills.skills;
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