

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

		const blacklistedDamageSources: string[] = ["genericKill", "slimesurvival.entropy_kill"];
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

	function tryCasualTransference(victim: LivingEntity_, attacker: ServerPlayer_) {
		if (!SkillHelper.hasSkill(attacker, FarlanderSkills.CASUAL_TRANSFERENCE)) return;

		const victimEntropy = EntropyHolder.get(victim);
		if (!victimEntropy) return;

		let target = getTransferenceTarget(attacker);
		if (!target) return;

		victimEntropy.transferAttackerEntropy(attacker, target);
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

	NativeEvents.onEvent($LivingEntityUseItemEvent$Finish, event => {
		const player = event.getEntity();
		if (!(player instanceof $ServerPlayer)) return;

		if (!SkillHelper.hasSkill(player, FarlanderSkills.NUTRITIONAL_UNCERTAINTY)) return;

		const stack = event.getItem();
		if (stack.getFoodProperties(player) === null) return;

		const food = player.getFoodData();
		const maxHunger = 20;
		if (food.foodLevel < maxHunger) {
			food.setSaturation(0.0);
		}
	});
}