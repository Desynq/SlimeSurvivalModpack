

namespace FarlanderEvents {

	EntityEvents.beforeHurt(event => {
		const victim = event.entity;
		const attacker = event.source.actual;

		if (!(victim instanceof $LivingEntity)) {
			return;
		}

		const attackerHasQuantumRending = EntropyHelper.isFromQuantumAttacker(victim, attacker);
		const isFarlander = victim instanceof $ServerPlayer && EntropyHelper.isFarlander(victim);
		if (!isFarlander && !attackerHasQuantumRending) {
			return;
		}

		const blacklistedDamageSources = ["genericKill", "slimesurvival.entropy"];
		if (ArrayHelper.includes(blacklistedDamageSources, event.source.getType())) {
			return;
		}

		let postAbsorptionDamage = applyAbsorptionDamage(victim, event.damage);

		const holder = EntropyHolder.getOrCreate(victim);

		let rendingPercentage = attackerHasQuantumRending
			? EntropyHelper.getEntropyPercentageFromAttacker(victim, attacker)
			: 0;

		if (rendingPercentage > 0) {
			let rendingDamage = postAbsorptionDamage * rendingPercentage;
			holder.pushEntropyEntry(rendingDamage, attacker);
			postAbsorptionDamage -= rendingDamage;
		}
		if (isFarlander) {
			holder.pushEntropyEntry(postAbsorptionDamage, attacker);
			postAbsorptionDamage = 0;
		}
		event.setDamage(postAbsorptionDamage);
	});

	function applyAbsorptionDamage(victim: LivingEntity_, damage: float) {
		const newAbsorptionValue = victim.absorptionAmount - damage;
		victim.setAbsorptionAmount(newAbsorptionValue);
		return -Math.min(newAbsorptionValue, 0);
	}

	function tickLorentzCurve(entity: Projectile_) {
		const customTickRate = TickHelper.getCustomTickRate(entity);
		if ($TickrateUtil["hasTimer(net.minecraft.world.entity.Entity)"](entity)) {
			if ($TickrateUtil["getTimer(net.minecraft.world.entity.Entity)"](entity).tickrate === customTickRate) return;
		}

		if (customTickRate == null) {
			$TickrateUtil.resetTickrate(entity);
		}
		else {
			$TickrateUtil.setTickrate(entity, customTickRate);
		}
	}

	NativeEvents.onEvent($EntityTickEvent$Pre, event => {
		const entity = event.getEntity();
		if (entity instanceof $LivingEntity) {
			EntropyHolder.tick(entity, false);
		}
		else if (entity instanceof $Projectile) {
			tickLorentzCurve(entity);
		}
	});


	PlayerEvents.respawned(event => {
		EntropyHelper.resetLifetimeEntropyDamage(event.player);
		const holder = EntropyHolder.get(event.player);
		if (holder === undefined) {
			return;
		}
		holder.resetEntropy();
	});



	EntityEvents.death(event => {
		const victim = event.getEntity();
		if (event.getSource().getType() === "slimesurvival.entropy") {
			const attacker = event.getSource().getActual();
			if (attacker instanceof $ServerPlayer) {
				eventHorizon(victim, attacker);
				casualTransference(victim, attacker);
			}
		}

		if (!(victim instanceof $ServerPlayer)) {
			EntropyHolder.delete(victim);
		}
	});

	function eventHorizon(victim: LivingEntity_, attacker: ServerPlayer_) {
		if (!SkillHelper.hasSkill(attacker, FarlanderSkills.EVENT_HORIZON)) return;
		if (!QuantumRelativityAbility.isActive(attacker)) return;

		const totalEntropyDamage = EntropyHelper.getLifetimeEntropyDamage(victim);
		attacker.health += MathHelper.clamped(0, attacker.maxHealth, attacker.health + totalEntropyDamage);
	}

	function getNearestDecayingEntity(attacker: ServerPlayer_, distance: double): LivingEntity_ | null {
		const conditions = $TargetingConditions.forNonCombat().selector(e => EntropyHolder.get(e)?.hasEntropyFrom(attacker) ?? false);
		const aabb = attacker.getBoundingBox().inflate(distance);
		return attacker.level.getNearestEntity($LivingEntity as any, conditions, attacker, attacker.x, attacker.y, attacker.z, aabb as any);
	}

	function getNearestAggressiveEntity(attacker: ServerPlayer_, distance: double): Mob_ | null {
		const conditions = $TargetingConditions.forNonCombat().selector((mob: LivingEntity_) => mob instanceof $Mob && LivingEntityHelper.isBeingTargetedBy(attacker, mob));
		const aabb = attacker.getBoundingBox().inflate(distance);
		return attacker.level.getNearestEntity($Mob as any, conditions, attacker, attacker.x, attacker.y, attacker.z, aabb as any);
	}

	function getTransferenceTarget(attacker: ServerPlayer_): LivingEntity_ | null {
		let target: LivingEntity_ | Mob_ | null = getNearestDecayingEntity(attacker, 16);
		if (target) return target;

		if (SkillHelper.hasSkill(attacker, FarlanderSkills.OBSERVER_EFFECT)) {
			target = getNearestAggressiveEntity(attacker, 16);
			if (target) return target as any;
		}

		return null;
	}

	function casualTransference(victim: LivingEntity_, attacker: ServerPlayer_) {
		if (!SkillHelper.hasSkill(attacker, FarlanderSkills.CASUAL_TRANSFERENCE)) return;

		const victimEntropy = EntropyHolder.get(victim);
		if (!victimEntropy) return;

		let target = getTransferenceTarget(attacker);
		if (!target) return;

		victimEntropy.transferAttackerEntropy(attacker, target);
	}
}