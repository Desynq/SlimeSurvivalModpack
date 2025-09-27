
namespace SludgeEvents {

	function asAntivenomPlayer(entity: unknown): ServerPlayer_ | null {
		return entity instanceof $ServerPlayer && SkillHelper.hasSkill(entity, SludgeSkills.ANTIVENOM)
			? entity
			: null;
	}

	NativeEvents.onEvent($LivingEntityUseItemEvent$Start, event => {
		Phagocytosis.onUseItemStart(event);
	});
	PlayerEvents.tick(event => {
		const player = SkillHelper.asPlayerWithSkill(event.getEntity(), SludgeSkills.ANTIVENOM);
		player && player.removeEffect($MobEffects.POISON);
	});
	NativeEvents.onEvent($LivingIncomingDamageEvent, event => {
		const player = SkillHelper.asPlayerWithSkill(event.getEntity(), SludgeSkills.ANTIVENOM);
		if (!player) return;
		if (event.getSource().getType() === "magic" && player.hasEffect($MobEffects.POISON)) {
			event.setCanceled(true);
		}
	});
}