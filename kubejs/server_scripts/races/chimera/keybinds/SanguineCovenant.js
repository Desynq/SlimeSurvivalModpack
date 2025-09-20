



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
			return 1200;
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
			chimera.player.tell(Text.red(`Cannot active Sanguine Convenant while on cooldown. (${max - curr} ticks left)`));
		}

		return {
			abilityDisabled: abilityDisabled,
			abilityEnabled: abilityEnabled,
			updateUI: updateUI,
			errorToggledWhileOnCooldown: errorToggledWhileOnCooldown
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
			DurationController.update(chimera);
			Sfx.abilityEnabled(chimera);
		}
		else {
			CooldownController.update(chimera);
			Sfx.abilityDisabled(chimera);
		}
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
			return;
		}
		if (chimera.player.isDeadOrDying() || DurationController.hasPassed(chimera)) {
			CooldownController.update(chimera);
			ToggleController.toggle(chimera);
			Sfx.abilityDisabled(chimera);
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

NativeEvents.onEvent($LivingIncomingDamageEvent, event => {
	const pair = PetHelper.getPetOwnerPair(event.getEntity(), $ServerPlayer);
	if (!pair) {
		return;
	}
	const { pet, owner } = pair;
	const chimera = PlayerRaceHelper.getRaceWrapper(owner);
	if (!(chimera instanceof ChimeraPlayer)) {
		return;
	}

	if (!SkillHelper.hasSkill(owner, ChimeraSkills.SANGUINE_COVENANT)) {
		return;
	}

	if (!SanguineConvenantAbility.isToggled(chimera)) {
		return;
	}

	const damage = event.getAmount();
	const minPossibleHealth = pet.maxHealth * (owner.health / owner.maxHealth);
	const newDamage = MathHelper.clamped(damage, 0, pet.health - minPossibleHealth);
	event.setAmount(newDamage);
});