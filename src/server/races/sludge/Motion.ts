const $CriticalHitEvent: typeof import("net.neoforged.neoforge.event.entity.player.CriticalHitEvent").$CriticalHitEvent = Java.loadClass("net.neoforged.neoforge.event.entity.player.CriticalHitEvent");



namespace SludgeMotion {

	function getMotionDamage(player: ServerPlayer_): double | null {
		const tier = SkillHelper.getSkillTier(player,
			SludgeSkills.MOTION_1,
			SludgeSkills.MOTION_2,
			SludgeSkills.MOTION_3,
			SludgeSkills.MOTION_4,
		);

		let base;
		switch (tier) {
			case 1:
				base = 0.25;
				break;
			case 2:
				base = 0.5;
				break;
			case 3:
				base = 1.0;
				break;
			case 4:
				base = 2.0;
				break;
			default:
				return null;
		}
		const stacks = getMotion(player);
		return base * stacks;
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
		const interval = SkillHelper.hasSkill(player, SludgeSkills.MOTION_4)
			? 20
			: 40;
		return TickHelper.hasTimestampElapsed(player, MOTION_TIMESTAMP, interval);
	}

	function resetMotion(player: ServerPlayer_): void {
		player.persistentData.remove(MOTION_KEY);
	}

	const MODIFIER_KEY = "sludge.motion_damage";

	NativeEvents.onEvent($CriticalHitEvent, event => {
		const player = event.getEntity();
		if (!(player instanceof $ServerPlayer)) return;

		const motionDamage = getMotionDamage(player);

		AttributeHelper.removeModifier(player, "minecraft:generic.attack_damage", MODIFIER_KEY);
		if (motionDamage == null) return;

		if (event.isCriticalHit()) {
			ActionbarManager.setSimple(player, `"Motion: ${getMotion(player)} (${motionDamage.toFixed(2)})"`, 20);
			incrementMotion(player);
			updateMotionTimestamp(player);
			AttributeHelper.addModifier(player, "minecraft:generic.attack_damage", MODIFIER_KEY, motionDamage, "add_value");
		}
		else {
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
			resetMotion(player);
		}
	});

	EntityEvents.afterHurt("minecraft:player", event => {
		const player = event.getEntity() as ServerPlayer_;

		if (getMotion(player) <= 0) return;
		if (SkillHelper.hasSkill(player, SludgeSkills.INERTIA)) {
			updateMotionTimestamp(player);
		}
	});
}