

namespace SludgeMotion {

	function getMotionDamage(player: ServerPlayer_): double | null {

		const tier = SkillHelper.getSkillTier(player,
			SludgeSkills.MOTION_1,
			SludgeSkills.MOTION_2,
			SludgeSkills.MOTION_3,
			SludgeSkills.MOTION_4,
		);

		let base: float;
		switch (tier) {
			case 1:
				base = 0.025;
				break;
			case 2:
				base = 0.05;
				break;
			case 3:
				base = 0.1;
				break;
			case 4:
				base = 0.2;
				break;
			default:
				return null;
		}
		const stacks = getMotion(player);
		return (base * player.maxHealth) * stacks;
	}

	function getMotionDuration(player: ServerPlayer_): number {
		const hasMotion4Skill = SludgeSkills.MOTION_4.isUnlockedFor(player);
		const hasMassSkill = SludgeSkills.MASS.isUnlockedFor(player);

		let duration = 40;
		if (hasMassSkill) {
			duration = Math.max(duration, Math.ceil(player.health));
		}
		if (hasMotion4Skill) {
			duration = Math.ceil(duration * 0.5);
		}
		return duration;
	}

	const MOTION_KEY = "sludge.motion";
	const MOTION_TIMESTAMP = "sludge.motion.last";

	function getMotion(player: ServerPlayer_): integer {
		return player.persistentData.getInt(MOTION_KEY);
	}

	function incrementMotion(player: ServerPlayer_): void {
		player.persistentData.putInt(MOTION_KEY, getMotion(player) + 1);
	}

	function updateMotionTimestamp(player: ServerPlayer_): void {
		TickHelper.forceUpdateTimestamp(player, MOTION_TIMESTAMP);
	}

	function motionExpired(player: ServerPlayer_): boolean {
		const duration = getMotionDuration(player);
		return TickHelper.hasTimestampElapsed(player, MOTION_TIMESTAMP, duration);
	}

	function resetMotion(player: ServerPlayer_): void {
		player.persistentData.remove(MOTION_KEY);
	}

	function removeModifier(player: ServerPlayer_): void {
		AttributeHelper.removeModifier(player, "minecraft:generic.attack_damage", MODIFIER_KEY);
	}

	function addModifier(player: ServerPlayer_, motionDamage: double): void {
		AttributeHelper.addModifier(player, "minecraft:generic.attack_damage", MODIFIER_KEY, motionDamage, "add_value");
	}

	const MODIFIER_KEY = "sludge.motion_damage";



	NativeEvents.onEvent($CriticalHitEvent, event => {
		const player = event.getEntity();
		if (!(player instanceof $ServerPlayer)) return;

		const motionDamage = getMotionDamage(player);
		if (motionDamage == null) return;

		removeModifier(player);
		if (event.isCriticalHit()) {
			ActionbarManager.setSimple(player, `"Motion: ${getMotion(player)} (${motionDamage.toFixed(2)})"`, 20);
			incrementMotion(player);
			updateMotionTimestamp(player);

			addModifier(player, motionDamage);
		}
		else {
			if (SkillHelper.hasSkill(player, SludgeSkills.CONTINUITY)) return;

			if (motionDamage > 0) {
				playsound(player.level, player.position(), "minecraft:entity.blaze.death", "master", 1, 2);
			}
			resetMotion(player);
		}
	});

	PlayerEvents.tick(event => {
		const player = event.getPlayer() as ServerPlayer_;

		if (getMotion(player) > 0 && motionExpired(player)) {
			playsound(player.level, player.position(), "minecraft:entity.blaze.death", "master", 1, 2);
			removeModifier(player);
			resetMotion(player);
		}
	});

	EntityEvents.afterHurt("minecraft:player" as any, event => {
		const player = event.getEntity() as ServerPlayer_;

		if (getMotion(player) <= 0) return;

		if (SkillHelper.hasSkill(player, SludgeSkills.INERTIA)) {
			updateMotionTimestamp(player);
		}
	});
}