
(function() {

	/**
	 * 
	 * @param {LivingEntity_} victim 
	 * @param {ServerPlayer_} player 
	 */
	function tickFirstStrike(victim, player) {
		if (!SkillHelper.hasSkill(player, DunestriderSkills.FIRST_STRIKE)) return;

		if (TickHelper.tryUpdateTimestamp(victim, "dunestrider.first_strike", 600)) {
			LivingEntityHelper.addEffect(player, 'minecraft:strength', 80, 1, false, true, true, player)
			return;
		}
	}

	/**
	 * 
	 * @param {LivingEntity_} victim 
	 * @param {ServerPlayer_} player 
	 */
	function tickMomentum(victim, player) {
		if (!SkillHelper.hasSkill(player, DunestriderSkills.MOMENTUM)) return;
		TickHelper.forceUpdateTimestamp(victim, 'dunestrider.momentum');
	}

	/**
	 * 
	 * @param {LivingEntity_} victim 
	 * @param {ServerPlayer_} player
	 */
	function tickRend(victim, player) {
		let skillLvl = SkillHelper.getSkillTier(player, DunestriderSkills.REND_1, DunestriderSkills.REND_2, DunestriderSkills.REND_3, DunestriderSkills.REND_4, DunestriderSkills.REND_5)
		if (skillLvl == 0) {
			return;
		}

		let amplifier = skillLvl - 1;
		LivingEntityHelper.addEffect(
			victim,
			'cataclysm:blazing_brand',
			30, amplifier, false, false, false,
			player
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

		if (victim.isBlocking()) return;
		if (!event.getSource().isDirect()) return;
		let itemAttr = attacker.getWeaponItem().getAttributeModifiers().modifiers();
		let validWeap = false;
		itemAttr.forEach(e => {
			if (e.attribute() !== $Attributes.ATTACK_DAMAGE) return;
			if (e.modifier().amount() < 5) return;
			validWeap = true;
		})
		if (!validWeap) return;

		tickRend(victim, attacker);

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

		tickFirstStrike(victim, attacker);
		tickMomentum(victim, attacker);

		if ((SkillHelper.hasSkill(attacker, DunestriderSkills.ROBINHOOD))) {
			let victimMaxHealth = victim.getMaxHealth();
			let playerMaxHealth = attacker.getMaxHealth();
			if ((playerMaxHealth * 0.5) > victimMaxHealth) {
				finalDmg = finalDmg * 0.5
			}
		}

		if ((SkillHelper.hasSkill(attacker, DunestriderSkills.FURANTUR_1))) {
			let skillLvl = SkillHelper.getSkillTier(attacker, DunestriderSkills.FURANTUR_1, DunestriderSkills.FURANTUR_2, DunestriderSkills.FURANTUR_3, DunestriderSkills.FURANTUR_4, DunestriderSkills.FURANTUR_5);
			let stealPercent = 0;
			switch (skillLvl) {
				case 1:
					stealPercent = 0.025;
				case 2:
					stealPercent = 0.050;
				case 3:
					stealPercent = 0.075;
				case 4:
					stealPercent = 0.100;
				case 5:
					stealPercent = 0.150;
			}
			let heal = finalDmg * stealPercent;
			let health = attacker.getHealth();
			attacker.setHealth(health + heal);
		}
		event.setDamage(finalDmg);
	});

	EntityEvents.beforeHurt(event => {
		let victim = event.getEntity();
		if (!(victim instanceof $ServerPlayer)) {
			return;
		}
		if (!(PlayerRaceHelper.isRace(victim, Races.DUNESTRIDER))) return;
		if (!(SkillHelper.hasSkill(victim, DunestriderSkills.MOMENTUM))) return;
		if (!event.source.isDirect()) return;
		let attacker = event.getSource().getActual();
		if (!(TickHelper.hasTimestampElapsed(attacker, "dunestrider.momentum", 300))) return;
		LivingEntityHelper.addEffect(victim, 'minecraft:slowness', 160, 0, false, true, true, attacker);
		let dmg = event.getDamage();
		dmg = dmg * 2.0;
		event.setDamage(dmg);

	});

})();

