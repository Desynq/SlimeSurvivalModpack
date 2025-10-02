
class LivingEntityHelper {
	public static addEffect(entity: LivingEntity_, id: string, duration: integer, amplifier: integer, ambient: boolean, visible: boolean, showIcon: boolean, source?: Entity_) {
		// @ts-ignore
		const effect = new $MobEffectInstance(id, duration, amplifier, ambient, visible, showIcon);
		source !== undefined
			? entity.addEffect(effect, source)
			: entity.addEffect(effect);
	}

	public static isBeingTargetedBy(entity: LivingEntity_, mob: Mob_) {
		return mob.getTarget() === entity;
	}

	public static removeHarmfulEffects(entity: LivingEntity_) {
		const harmfulEffects = entity.getActiveEffects().stream()
			.filter(effect => !effect.getEffect().value().isBeneficial())
			.toList();
		harmfulEffects.forEach(effect => entity.removeEffect(effect.getEffect()));
	}
}