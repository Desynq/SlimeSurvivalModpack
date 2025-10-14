// priority: -1

(function() {
	/**
	 * @param {import("net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent").$LivingIncomingDamageEvent$$Original} event 
	 * @param {import("net.minecraft.world.entity.TamableAnimal").$TamableAnimal$$Original} pet 
	 * @param {ChimeraPlayer} chimera 
	 */
	function tickSanguineCovenant(event, pet, chimera) {
		if (!SkillHelper.hasSkill(chimera.player, ChimeraSkills.SANGUINE_COVENANT)) {
			return;
		}

		if (!SanguineConvenantAbility.isToggled(chimera)) {
			return;
		}

		const damage = event.getAmount();
		const minPossibleHealth = pet.maxHealth * (chimera.player.health / chimera.player.maxHealth);
		const newDamage = MathHelper.clamped(damage, 0, pet.health - minPossibleHealth);
		event.setAmount(newDamage);
	}

	/**
	 * @param {import("net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent").$LivingIncomingDamageEvent$$Original} event 
	 * @param {import("net.minecraft.world.entity.TamableAnimal").$TamableAnimal$$Original} pet 
	 * @param {ChimeraPlayer} chimera 
	 */
	function tickFallProtection(event, pet, chimera) {
		if (!SkillHelper.hasSkill(chimera.player, ChimeraSkills.FALL_PROTECTION)) {
			return;
		}

		if (event.getSource().getType() !== "fall") {
			return;
		}
		event.setCanceled(true);
	}


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

		tickFallProtection(event, pet, chimera);
		if (event.canceled) {
			return;
		}
		tickSanguineCovenant(event, pet, chimera);
	});
})();