// priority: 1
const PerfectCovenant = (function() {
	const KEY = "chimera.perfect_covenant.proc"

	/**
	 * @param {ChimeraPlayer} chimera 
	 */
	function proc(chimera) {
		if (!SkillHelper.hasSkill(chimera.player, ChimeraSkills.PERFECT_COVENANT)) {
			return;
		}
		if (chimera.player.health < chimera.player.maxHealth) {
			return;
		}
		chimera.player.persistentData.putBoolean(KEY, true);
	}

	/**
	 * @param {ChimeraPlayer} chimera 
	 */
	function deproc(chimera) {
		chimera.player.persistentData.putBoolean(KEY, false);
	}

	/**
	 * @param {ChimeraPlayer} chimera 
	 */
	function hasProcced(chimera) {
		return chimera.player.persistentData.getBoolean(KEY);
	}

	return {
		proc: proc,
		deproc: deproc,
		hasProcced: hasProcced
	}
})();