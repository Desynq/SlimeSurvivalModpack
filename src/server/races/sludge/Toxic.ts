
namespace SludgeToxic {

	function getLastingToxinTier(player: ServerPlayer_) {
		return SkillHelper.getSkillTier(player,
			SludgeSkills.LONG_LASTING_TOXIN_1,
			SludgeSkills.LONG_LASTING_TOXIN_2,
			SludgeSkills.LONG_LASTING_TOXIN_3,
		);
	}

	function getLethalToxinTier(player: ServerPlayer_) {
		return SkillHelper.getSkillTier(player,
			SludgeSkills.LETHAL_TOXIN_1,
			SludgeSkills.LETHAL_TOXIN_2,
			SludgeSkills.LETHAL_TOXIN_3
		);
	}

	function getPoisonTickDuration(player: ServerPlayer_) {
		const lastingToxinTier = getLastingToxinTier(player);
		const lethalToxinTier = getLethalToxinTier(player);

		let duration = 100;
		duration = (duration * Math.pow(2, lastingToxinTier)) / (lethalToxinTier + 1);
		return duration;
	}

	function getPoisonAmplifier(player: ServerPlayer_) {
		const lethalToxinTier = getLethalToxinTier(player);
		return lethalToxinTier;
	}

	function isWithinRange(player: ServerPlayer_, attacker: LivingEntity_) {
		const threshold = player.getAttributeTotalValue($Attributes.ENTITY_INTERACTION_RANGE);
		const thresholdSqr = threshold * threshold;

		const distanceSqr = player.distanceToEntitySqr(attacker);
		return distanceSqr <= thresholdSqr;
	}

	EntityEvents.afterHurt("minecraft:player", event => {
		const player = event.getEntity() as ServerPlayer_;
		if (!SkillHelper.hasSkill(player, SludgeSkills.TOXIC)) return;

		const attacker = event.getSource().getActual();
		if (!(attacker instanceof $LivingEntity)) return;
		if (attacker === player) return;
		if (!isWithinRange(player, attacker)) return;

		const duration = getPoisonTickDuration(player);
		const amplifier = getPoisonAmplifier(player);
		const effectId = SkillHelper.hasSkill(player, SludgeSkills.WITHERING)
			? "minecraft:wither"
			: "minecraft:poison";
		LivingEntityHelper.addEffect(attacker, effectId, duration, amplifier, false, true, true);
	});
}