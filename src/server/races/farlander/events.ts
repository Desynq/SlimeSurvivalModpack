

namespace FarlanderEvents {

	function isBlacklistedDamageSource(type: string): boolean {
		const blacklistedDamageSources = ["genericKill", "slimesurvival.entropy_kill"];
		return blacklistedDamageSources.includes(type);
	}

	EntityEvents.beforeHurt(event => {
		const victim = event.entity;
		const attacker = event.source.actual;

		if (!(victim instanceof $LivingEntity)) {
			return;
		}
		if (!EntropyHelper.canReceiveEntropy(victim)) {
			return;
		}

		const attackerHasQuantumRending = EntropyHelper.isFromQuantumAttacker(victim, attacker);
		const isFarlander = victim instanceof $ServerPlayer && EntropyHelper.isFarlander(victim);
		if (!isFarlander && !attackerHasQuantumRending) {
			return;
		}

		if (isBlacklistedDamageSource(event.source.getType())) return;

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

	NativeEvents.onEvent($EntityTickEvent$Pre, event => {
		const entity = event.getEntity();
		if (entity instanceof $LivingEntity) {
			EntropyHolder.tick(entity, false);
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


	function isEntropyDeath(source: DamageSource_): boolean {
		return source.getType() === "slimesurvival.entropy_kill";
	}

	EntityEvents.death(event => {
		const deadEntity = event.getEntity();
		const killer = event.getSource().getActual();

		if (killer instanceof $ServerPlayer) {
			if (isEntropyDeath(event.source)) {
				tryEventHorizon(deadEntity, killer);
			}

			tryCasualTransference(deadEntity, killer);
			tryCausalityCollapse(deadEntity, killer);
		}

		if (!(deadEntity instanceof $ServerPlayer)) {
			EntropyHolder.delete(deadEntity);
		}
	});


	/**
	 * Attacker loses entropy from the victim
	 */
	function tryCausalityCollapse(deadEntity: LivingEntity_, killer: ServerPlayer_) {
		if (!SkillHelper.hasSkill(killer, FarlanderSkills.CAUSALITY_COLLAPSE)) return;

		const killerEntropy = EntropyHolder.get(killer);
		if (!killerEntropy) return;

		killerEntropy.removeEntriesFromAttacker(deadEntity);
	}

	function tryEventHorizon(victim: LivingEntity_, attacker: ServerPlayer_) {
		if (!SkillHelper.hasSkill(attacker, FarlanderSkills.EVENT_HORIZON)) return;
		if (!QuantumRelativity.isActive(attacker)) return;

		const totalEntropyDamage = EntropyHelper.getLifetimeEntropyDamage(victim);
		attacker.health += MathHelper.clamped(0, attacker.maxHealth, attacker.health + totalEntropyDamage);
	}



	function getNearestDecayingEntity(victim: LivingEntity_, attacker: ServerPlayer_, distance: double): LivingEntity_ | null {
		const conditions = $TargetingConditions.forNonCombat().selector(entity =>
			EntropyHolder.get(entity)?.hasEntropyFrom(attacker) ?? false
		);

		const aabb = victim.getBoundingBox().inflate(distance);
		return victim.level.getNearestEntity($LivingEntity as any, conditions, victim, victim.x, victim.y, victim.z, aabb as any);
	}

	function getNearestAggressiveEntity(victim: LivingEntity_, attacker: ServerPlayer_, distance: double): Mob_ | null {
		const conditions = $TargetingConditions.forNonCombat().selector((entity: LivingEntity_) =>
			entity instanceof $Mob && entity.getTarget() === attacker && EntropyHelper.canReceiveEntropy(entity as any)
		);

		const aabb = victim.getBoundingBox().inflate(distance);
		return victim.level.getNearestEntity($Mob as any, conditions, victim, victim.x, victim.y, victim.z, aabb as any);
	}

	function getTransferenceTarget(victim: LivingEntity_, attacker: ServerPlayer_): LivingEntity_ | null {
		let target: LivingEntity_ | Mob_ | null = getNearestDecayingEntity(victim, attacker, 16);
		if (target) return target;

		if (FarlanderSkills.OBSERVER_EFFECT.isUnlockedFor(attacker)) {
			target = getNearestAggressiveEntity(victim, attacker, 16);
			if (target) return target as any;
		}

		return null;
	}

	function tryCasualTransference(victim: LivingEntity_, attacker: ServerPlayer_) {
		if (!SkillHelper.hasSkill(attacker, FarlanderSkills.CASUAL_TRANSFERENCE)) return;

		const victimEntropy = EntropyHolder.get(victim);
		if (!victimEntropy) return;

		let target = getTransferenceTarget(victim, attacker);
		if (!target) return;

		victimEntropy.transferAttackerEntropy(attacker, target);

		const distance = Math.ceil(victim.distanceToEntity(target));
		const pos1 = victim.eyePosition;
		const pos2 = target.eyePosition;
		ParticleHelper.drawLineVec(victim.level as any, pos1, pos2, distance * 2, "soul_fire_flame", 0, true);
	}


	function canQuantumTunnel(player: ServerPlayer_) {
		return SkillHelper.hasSkill(player, FarlanderSkills.QUANTUM_TUNNELING) && QuantumRelativity.isActive(player);
	}

	ItemEvents.rightClicked(event => {
		const player = event.getEntity();
		if (!(player instanceof $ServerPlayer)) return;

		const stack = event.getItem();

		if (player.hasInfiniteMaterials()) return;

		if (stack.id as string !== "minecraft:ender_pearl") return;

		if (!canQuantumTunnel(player)) return;

		stack.grow(1);
	});

	NativeEvents.onEvent($EntityTeleportEvent$EnderPearl, event => {
		const player = event.getEntity();
		if (!(player instanceof $ServerPlayer)) return;

		if (canQuantumTunnel(player)) {
			event.setAttackDamage(0);
		}
	});

	PlayerEvents.loggedOut(event => {
		const player = event.entity as ServerPlayer_;
		if (QuantumRelativity.isActive(player)) {
			QuantumRelativity.onDisconnect(player);
		}
	});
}