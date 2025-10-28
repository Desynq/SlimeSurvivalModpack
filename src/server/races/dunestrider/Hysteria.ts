

namespace HysteriaSkill {
	const MOVE_SPEED_MOD = new AttributeModifierController("minecraft:generic.movement_speed", "dunestrider.hysteria.speed", 0, "add_value");
	const ATTACK_SPEED_MOD = new AttributeModifierController("minecraft:generic.attack_speed", "dunestrider.hysteria.speed", 0, "add_value");

	export function tickHysteria(player: ServerPlayer_): void {
		MOVE_SPEED_MOD.remove(player);
		ATTACK_SPEED_MOD.remove(player);
		if (hasMaxHysteria(player)) {
			setMaxHysteria(player, false);
		}

		if (FocusAbility.isActiveOrCharging(player)) return;

		let hysteriaTier = SkillHelper.getSequentialSkillTier(player,
			DunestriderSkills.HYSTERIA_1,
			DunestriderSkills.HYSTERIA_2,
			DunestriderSkills.HYSTERIA_3
		);
		if (hysteriaTier === 0) return;

		const enemies = getEnemies(player);
		const enemyCount = enemies.length;
		let baseMoveSpeed = player.getAttributeBaseValue($Attributes.MOVEMENT_SPEED);
		let baseAttackSpeed = player.getAttributeBaseValue($Attributes.ATTACK_SPEED);

		const threat = getThreat(player);

		let extraMoveSpeed = getMovementSpeedBuff(threat, baseMoveSpeed);
		const hasMaxMoveSpeed = extraMoveSpeed >= baseMoveSpeed;

		let extraAttackSpeed = enemyCount * 0.25;

		let capAttackSpeed = baseAttackSpeed * 2;

		let hasMaxAttackSpeed = false;

		if (extraAttackSpeed + baseAttackSpeed > capAttackSpeed) {
			extraAttackSpeed = capAttackSpeed;
			hasMaxAttackSpeed = true;
		}

		if (hysteriaTier >= 1) {
			MOVE_SPEED_MOD.apply(player, extraMoveSpeed);
		}

		if (hysteriaTier >= 2) {
			ATTACK_SPEED_MOD.apply(player, extraAttackSpeed);
		}

		if (hysteriaTier >= 3) {
			if (hasMaxMoveSpeed && hasMaxAttackSpeed) {
				setMaxHysteria(player, true);
			}
		}
	}

	export function hasMaxHysteria(player: ServerPlayer_): boolean {
		return player.persistentData.getBoolean("dunestrider.hysteria.is_max");
	}

	function setMaxHysteria(player: ServerPlayer_, flag: boolean): void {
		player.persistentData.putBoolean("dunestrider.hysteria.is_max", flag);
	}

	function isTargeting(mob: Mob_, player: ServerPlayer_): boolean {
		return mob.getTarget() == player;
	}

	function getEnemies(player: ServerPlayer_): Mob_[] {
		const aabb = player.boundingBox.inflate(16);
		return player.level.getEntitiesOfClass($Mob as any, aabb as any, (mob: Mob_) => isTargeting(mob, player)).toArray() as Mob_[];
	}

	function getThreat(player: ServerPlayer_): number {
		const enemies = getEnemies(player);
		const enemyCount = enemies.length;
		if (enemyCount === 0) return 0.0;

		const invHealth = 1.0 / player.maxHealth;
		const cap = player.maxHealth * 5.0;
		let sumSquares = 0.0;

		for (const mob of enemies) {
			const dmg = mob.getAttributeValue($Attributes.ATTACK_DAMAGE);
			const threat = Math.min(dmg * invHealth, cap);
			sumSquares += threat ** 2;
		}

		const rmsThreat = Math.sqrt(sumSquares / enemyCount);

		return rmsThreat;
	}

	/**
	 * Calculates the additive movement speed buff based on current threat level.
	 *
	 * The relationship follows `value = threat / (20 / baseMoveSpeed + threat)`,
	 * producing smooth diminishing returns as threat increases.
	 *
	 * The resulting buff is clamped between `0` and `baseMoveSpeed`,
	 * ensuring the total movement speed never exceeds double the base speed.
	 */
	function getMovementSpeedBuff(threat: number, baseMoveSpeed: number): number {
		if (threat <= 0) return 0.0;

		const factor = 5.0 / baseMoveSpeed;
		const cap = baseMoveSpeed;

		const value = threat / (factor + threat);
		return MathHelper.clamped(value, 0.0, cap);
	}
}