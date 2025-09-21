const OldQuantumRelativityAbilityOld = (function() {

	const ToggleController = (function() {
		const KEY = "farlander.quantum_relativity.toggle";

		/**
		 * 
		 * @param {ServerPlayer} player 
		 */
		function isToggled(player) {
			return player.persistentData.getBoolean(KEY);
		}

		/**
		 * 
		 * @param {ServerPlayer} player 
		 */
		function toggle(player) {
			player.persistentData.putBoolean(KEY, !isToggled(player));
		}

		return {
			isToggled: isToggled,
			toggle: toggle
		};
	})();


	const CooldownController = (function() {
		const KEY = "farlander.quantum_relativity.cooldown";

		/**
		 * @param {ServerPlayer} player 
		 */
		function getMax(player) {
			let max = 100;
			return max;
		}

		/**
		 * 
		 * @param {ServerPlayer} player 
		 */
		function hasPassed(player) {
			return TickHelper.hasTimestampPassed(player, KEY, getMax(player));
		}

		/**
		 * 
		 * @param {ServerPlayer} player 
		 */
		function getCurr(player) {
			return TickHelper.getTimestampDiff(player, KEY);
		}

		/**
		 * 
		 * @param {ServerPlayer} player 
		 */
		function update(player) {
			TickHelper.forceUpdateTimestamp(player, KEY);
		}

		/**
		 * 
		 * @param {ServerPlayer} player 
		 */
		function reset(player) {
			TickHelper.resetTimestamp(player, KEY);
		}

		return {
			getMax: getMax,
			hasPassed: hasPassed,
			getCurr: getCurr,
			update: update,
			reset: reset
		};
	})();

	const DurationController = (function() {
		const KEY = "farlander.quantum_relativity.duration";

		/**
		 * @param {ServerPlayer} player 
		 */
		function getMax(player) {
			return 200;
		}

		/**
		 * 
		 * @param {ServerPlayer} player 
		 */
		function hasPassed(player) {
			return TickHelper.hasTimestampPassed(player, KEY, getMax(player));
		}

		/**
		 * 
		 * @param {ServerPlayer} player 
		 */
		function getCurr(player) {
			return TickHelper.getTimestampDiff(player, KEY);
		}

		/**
		 * 
		 * @param {ServerPlayer} player 
		 */
		function update(player) {
			TickHelper.forceUpdateTimestamp(player, KEY);
		}

		return {
			getMax: getMax,
			hasPassed: hasPassed,
			getCurr: getCurr,
			update: update
		};
	})();


	const Sfx = (function() {

		/**
		 * @param {ServerPlayer} player 
		 */
		function abilityEnabled(player) {
			playsound(player.level, player.position(), "minecraft:block.beacon.activate", "master", 2, 2);
		}

		/**
		 * @param {ServerPlayer} player 
		 */
		function abilityDisabled(player) {
			playsound(player.level, player.position(), "minecraft:block.beacon.deactivate", "master", 2, 2);
		}

		/**
		 * @param {ServerPlayer} player 
		 */
		function displayCooldown(player) {
			const timeLeft = CooldownController.getMax(player) - CooldownController.getCurr(player);
			ActionbarManager.addSimple(player, `Relativity CD: ${TickHelper.toSeconds(player.server, timeLeft)}`);
		}

		/**
		 * 
		 * @param {ServerPlayer} player 
		 */
		function updateUI(player) {
			const max = DurationController.getMax(player);
			const curr = DurationController.getCurr(player);
			ActionbarManager.addSimple(player, `Relativity: ${max - curr}`);
		}

		/**
		 * 
		 * @param {ServerPlayer} player 
		 */
		function errorToggledWhileOnCooldown(player) {
			const max = CooldownController.getMax(player);
			const curr = CooldownController.getCurr(player);
			// @ts-ignore
			player.tell(Text.red(`Cannot activate Quantum Relativity while on cooldown. (${max - curr} ticks left)`));
		}

		return {
			abilityDisabled: abilityDisabled,
			abilityEnabled: abilityEnabled,
			updateUI: updateUI,
			errorToggledWhileOnCooldown: errorToggledWhileOnCooldown,
			displayCooldown: displayCooldown
		};
	})();

	/**
	 * 
	 * @param {FarlanderPlayer} farlander 
	 */
	function onPress(farlander) {

	}

	/**
	 * 
	 * @param {FarlanderPlayer} farlander 
	 */
	function onTick(farlander) { }
})();