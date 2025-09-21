
(function() {
	/**
	 * 
	 * @param {LivingEntity} victim 
	 * @param {DunestriderPlayer} dunestrider 
	 */
	function tickRend(victim, dunestrider) {
		let skillLvl = SkillHelper.getSkillTier(dunestrider.player, DunestriderSkills.REND_1, DunestriderSkills.REND_2, DunestriderSkills.REND_3, DunestriderSkills.REND_4, DunestriderSkills.REND_5)
		if (skillLvl == 0) {
			return;
		}

		let amplifier = skillLvl - 1;
		LivingEntityHelper.addEffect(
			victim,
			'cataclysm:blazing_brand',
			30, amplifier, false, false, false,
			dunestrider.player
		);
	}

	EntityEvents.beforeHurt(event => {
		let victim = event.getEntity();
		if (!(victim instanceof $LivingEntity)) {
			return;
		}
		let attacker = event.getSource().getActual();
		if (!(attacker instanceof $ServerPlayer)) {
			return;
		}

		let dunestrider = PlayerRaceHelper.getRaceWrapper(attacker);
		if (!(dunestrider instanceof DunestriderPlayer)) {
			return;
		}
		if (victim.isBlocking()) return;
		if (!event.getSource().isDirect()) return;

		tickRend(victim, dunestrider);

		let finalDmg = event.getDamage();
		if ((SkillHelper.hasSkill(attacker, DunestriderSkills.DEMEAN_1))) {
			let skillLvl = SkillHelper.getSkillTier(attacker, DunestriderSkills.DEMEAN_1, DunestriderSkills.DEMEAN_2, DunestriderSkills.DEMEAN_3)
			let victimMaxHealth = victim.getMaxHealth();
			let victimHealth = victim.getHealth();
			let dropoff = 0;
			let extraDmg = 0
			switch (skillLvl) {
				case 1:
					dropoff = 0.75
					extraDmg = victimMaxHealth * 0.025;
					break;
				case 2:
					dropoff = 0.50
					extraDmg = victimMaxHealth * 0.030;
					break;
				case 3:
					dropoff = 0.33
					extraDmg = victimMaxHealth * 0.050;
					break;
			}
			if (victimMaxHealth * dropoff >= victimHealth) return;
			let dmg = event.getDamage();
			finalDmg = dmg + extraDmg;
		}

		if ((SkillHelper.hasSkill(attacker, DunestriderSkills.ROBINHOOD))) {
			let victimMaxHealth = victim.getMaxHealth();
			let playerMaxHealth = attacker.getMaxHealth();
			if ((playerMaxHealth * 0.5) > victimMaxHealth) {
				finalDmg = finalDmg * 0.5
			}
		}
		if ((SkillHelper.hasSkill(attacker, DunestriderSkills.FURANTUR_1))) {
			let heal = finalDmg * 0.025;
			let health = attacker.getHealth();
			attacker.setHealth(health + heal);
		}
		event.setDamage(finalDmg);
	});
})();