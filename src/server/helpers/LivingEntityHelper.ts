
class LivingEntityHelper {
	public static addEffect(entity: LivingEntity_, id: string, duration: integer, amplifier: integer, ambient: boolean, visible: boolean, showIcon: boolean, source?: Entity_): void {
		// @ts-ignore
		const effect = new $MobEffectInstance(id, duration, amplifier, ambient, visible, showIcon);
		source !== undefined
			? entity.addEffect(effect, source)
			: entity.addEffect(effect);
	}

	public static applyEffectUntilExpired(entity: LivingEntity_, id: string, duration: integer, threshold: integer, amplifier: integer, ambient: boolean, visible: boolean, showIcon: boolean, source?: Entity_): void {
		const currentEffect = entity.getEffect($BuiltInRegistries.MOB_EFFECT.getHolderOrThrow($ResourceKey.create($Registries.MOB_EFFECT, id)));
		if (currentEffect) {
			const currentDuration = currentEffect.getDuration();
			if (currentDuration > threshold) return;
		}

		this.addEffect(entity, id, duration, amplifier, ambient, visible, showIcon, source);
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

	public static removeEffect(entity: LivingEntity_, id: string) {
		const effect = $BuiltInRegistries.MOB_EFFECT.getHolderOrThrow($ResourceKey.create($Registries.MOB_EFFECT, id));
		entity.removeEffect(effect);
	}
}