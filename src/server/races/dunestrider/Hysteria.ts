

namespace HysteriaSkill {
	const MOVE_SPEED_MOD = new AttributeModifierController("minecraft:generic.movement_speed", "dunestrider.hysteria.speed", 0, "add_value");
	const ATTACK_SPEED_MOD = new AttributeModifierController("minecraft:generic.attack_speed", "dunestrider.hysteria.speed", 0, "add_value");

	export function tickHysteria(player: ServerPlayer_): void {
		MOVE_SPEED_MOD.remove(player);
		ATTACK_SPEED_MOD.remove(player);
		if (hasMaxHysteria(player)) {
			player.persistentData.putBoolean('dunestrider.hysteria.is_max', false);
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

		let extraMoveSpeed = getMovementSpeedBuff(player.maxHealth, baseMoveSpeed, enemies);
		const hasMaxMoveSpeed = extraMoveSpeed >= baseMoveSpeed;

		let extraAttackSpeed = enemyCount * 0.25;

		let capAttackSpeed = baseAttackSpeed * 2;

		let hasMaxStackAttackSpeed = false;

		if (extraAttackSpeed + baseAttackSpeed > capAttackSpeed) {
			extraAttackSpeed = capAttackSpeed;
			hasMaxStackAttackSpeed = true;
		}

		if (hysteriaTier >= 1) {
			MOVE_SPEED_MOD.apply(player, extraMoveSpeed);
		}

		if (hysteriaTier >= 2) {
			ATTACK_SPEED_MOD.apply(player, extraAttackSpeed);
		}

		if (hysteriaTier >= 3) {
			if (hasMaxMoveSpeed && hasMaxStackAttackSpeed) {
				player.persistentData.putBoolean('dunestrider.hysteriamax', true);
			}
		}
	}

	export function hasMaxHysteria(player: ServerPlayer_): boolean {
		return player.persistentData.getBoolean("dunestrider.hysteria.is_max");
	}



	function isTargeting(mob: Mob_, player: ServerPlayer_): boolean {
		return mob.getTarget() == player;
	}

	function targetedByNum(player: ServerPlayer_): integer {
		let aabb = player.getBoundingBox().inflate(16, 16, 16);
		// @ts-ignore
		return player.level.getEntitiesOfClass($Mob, aabb, mob => isTargeting(mob, player)).size();
	}

	function getEnemies(player: ServerPlayer_): Mob_[] {
		const aabb = player.boundingBox.inflate(16);
		return player.level.getEntitiesOfClass($Mob as any, aabb as any, (mob: Mob_) => isTargeting(mob, player)).toArray() as Mob_[];
	}

	function getMovementSpeedBuff(playerMaxHealth: number, baseMoveSpeed: number, enemies: Mob_[]): number {
		const count = enemies.length;
		if (count === 0) return 0.0;
		const averageEnemyHealth = enemies.reduce((sum, mob) => sum + mob.health, 0.0) / enemies.length;
		const factor = 20.0 / baseMoveSpeed;
		const cap = baseMoveSpeed;
		const threat = averageEnemyHealth / playerMaxHealth * count;

		const value = threat / (factor + threat);
		return MathHelper.clamped(value, 0.0, cap);
	}
}