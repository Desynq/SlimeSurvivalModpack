// priority: 0
const SanguineConvenantAbility = (function() {

	const ToggleController = (function() {
		const KEY = "chimera.sanguine_convenant.toggle";

		/**
		 * 
		 * @param {ChimeraPlayer} chimera 
		 */
		function isToggled(chimera) {
			return chimera.player.persistentData.getBoolean(KEY);
		}

		/**
		 * 
		 * @param {ChimeraPlayer} chimera 
		 */
		function toggle(chimera) {
			chimera.player.persistentData.putBoolean(KEY, !isToggled(chimera));
		}

		return {
			isToggled: isToggled,
			toggle: toggle
		}
	})();


	const CooldownController = (function() {
		const KEY = "chimera.sanguine_convenant.cooldown";

		/**
		 * @param {ChimeraPlayer} chimera 
		 */
		function getMax(chimera) {
			let max = 1200;
			if (PerfectCovenant.hasProcced(chimera)) {
				max *= 0.5;
			}
			return max;
		}

		/**
		 * 
		 * @param {ChimeraPlayer} chimera 
		 */
		function hasPassed(chimera) {
			return TickHelper.hasTimestampPassed(chimera.player, KEY, getMax(chimera));
		}

		/**
		 * 
		 * @param {ChimeraPlayer} chimera 
		 */
		function getCurr(chimera) {
			return TickHelper.getTimestampDiff(chimera.player, KEY);
		}

		/**
		 * 
		 * @param {ChimeraPlayer} chimera 
		 */
		function update(chimera) {
			TickHelper.forceUpdateTimestamp(chimera.player, KEY);
		}

		/**
		 * 
		 * @param {ChimeraPlayer} chimera 
		 */
		function reset(chimera) {
			TickHelper.resetTimestamp(chimera.player, KEY);
		}

		return {
			getMax: getMax,
			hasPassed: hasPassed,
			getCurr: getCurr,
			update: update,
			reset: reset
		}
	})();

	const DurationController = (function() {
		const KEY = "chimera.sanguine_convenant.duration";

		/**
		 * @param {ChimeraPlayer} chimera 
		 */
		function getMax(chimera) {
			return 300;
		}

		/**
		 * 
		 * @param {ChimeraPlayer} chimera 
		 */
		function hasPassed(chimera) {
			return TickHelper.hasTimestampPassed(chimera.player, KEY, getMax(chimera));
		}

		/**
		 * 
		 * @param {ChimeraPlayer} chimera 
		 */
		function getCurr(chimera) {
			return TickHelper.getTimestampDiff(chimera.player, KEY);
		}

		/**
		 * 
		 * @param {ChimeraPlayer} chimera 
		 */
		function update(chimera) {
			TickHelper.forceUpdateTimestamp(chimera.player, KEY);
		}

		return {
			getMax: getMax,
			hasPassed: hasPassed,
			getCurr: getCurr,
			update: update
		}
	})();


	const Sfx = (function() {

		/**
		 * @param {ChimeraPlayer} chimera 
		 */
		function abilityEnabled(chimera) {
			playsound(chimera.player.level, chimera.player.position(), "minecraft:block.beacon.activate", "master", 2, 2);
		}

		/**
		 * @param {ChimeraPlayer} chimera 
		 */
		function abilityDisabled(chimera) {
			playsound(chimera.player.level, chimera.player.position(), "minecraft:block.beacon.deactivate", "master", 2, 2);
		}

		/**
		 * @param {ChimeraPlayer} chimera 
		 */
		function displayCooldown(chimera) {
			const timeLeft = CooldownController.getMax(chimera) - CooldownController.getCurr(chimera);
			ActionbarManager.addSimple(chimera.player, `Covenant CD: ${TickHelper.toSeconds(chimera.player.server, timeLeft)}`);
		}

		/**
		 * 
		 * @param {ChimeraPlayer} chimera 
		 */
		function updateUI(chimera) {
			const max = DurationController.getMax(chimera);
			const curr = DurationController.getCurr(chimera);
			ActionbarManager.addSimple(chimera.player, `Sanguine Covenant: ${max - curr}`);
		}

		/**
		 * 
		 * @param {ChimeraPlayer} chimera 
		 */
		function errorToggledWhileOnCooldown(chimera) {
			const max = CooldownController.getMax(chimera);
			const curr = CooldownController.getCurr(chimera);
			// @ts-ignore
			chimera.player.tell(Text.red(`Cannot activate Sanguine Convenant while on cooldown. (${max - curr} ticks left)`));
		}

		return {
			abilityDisabled: abilityDisabled,
			abilityEnabled: abilityEnabled,
			updateUI: updateUI,
			errorToggledWhileOnCooldown: errorToggledWhileOnCooldown,
			displayCooldown: displayCooldown
		}
	})();

	/**
	 * 
	 * @param {ChimeraPlayer} chimera 
	 */
	function tryToToggleSkill(chimera) {
		if (!SkillHelper.hasSkill(chimera.player, ChimeraSkills.SANGUINE_COVENANT)) {
			return;
		}

		if (!CooldownController.hasPassed(chimera)) {
			Sfx.errorToggledWhileOnCooldown(chimera);
			return;
		}

		ToggleController.toggle(chimera);
		if (ToggleController.isToggled(chimera)) {
			CooldownController.reset(chimera);
			PerfectCovenant.deproc(chimera);
			DurationController.update(chimera);
			Sfx.abilityEnabled(chimera);
		}
		else {
			handleAbilityCancel(chimera);
		}
	}

	/**
	 * 
	 * @param {ChimeraPlayer} chimera 
	 */
	function handleAbilityCancel(chimera) {
		handleCovenantRestoration(chimera);
		CooldownController.update(chimera);
		Sfx.abilityDisabled(chimera);
	}

	/**
	 * 
	 * @param {ChimeraPlayer} chimera 
	 */
	function handleAbilityExpiration(chimera) {
		handleCovenantRestoration(chimera);
		PerfectCovenant.proc(chimera);

		CooldownController.update(chimera);
		ToggleController.toggle(chimera);
		Sfx.abilityDisabled(chimera);
	}

	/**
	 * 
	 * @param {ChimeraPlayer} chimera 
	 */
	function handleDeathDuringAbility(chimera) {
		CooldownController.update(chimera);
		ToggleController.toggle(chimera);
		Sfx.abilityDisabled(chimera);
	}

	/**
	 * 
	 * @param {ChimeraPlayer} chimera 
	 */
	function handleCovenantRestoration(chimera) {
		if (!SkillHelper.hasSkill(chimera.player, ChimeraSkills.COVENANT_RESTORATION)) {
			return;
		}

		PlayerHelper.getPetsFollowing(chimera.player).forEach(pet => {
			pet.health = pet.maxHealth;
		})
	}



	/**
	 * 
	 * @param {ChimeraPlayer} chimera 
	 */
	function onPress(chimera) {
		tryToToggleSkill(chimera);
	}

	/**
	 * @param {ChimeraPlayer} chimera 
	 */
	function onTick(chimera) {
		if (!ToggleController.isToggled(chimera)) {
			if (!CooldownController.hasPassed(chimera)) {
				Sfx.displayCooldown(chimera);
			}
			return;
		}
		if (chimera.player.isDeadOrDying()) {
			handleDeathDuringAbility(chimera);
			return;
		}
		if (DurationController.hasPassed(chimera)) {
			handleAbilityExpiration(chimera);
			return;
		}

		Sfx.updateUI(chimera);
	}

	return {
		onPress: onPress,
		onTick: onTick,
		isToggled: ToggleController.isToggled
	}
})();