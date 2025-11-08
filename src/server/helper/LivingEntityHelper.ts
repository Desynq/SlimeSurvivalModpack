// priority: 1000

class LivingEntityHelper {
	public static addEffect(entity: LivingEntity_, id: string, duration: integer, amplifier: integer, ambient: boolean, visible: boolean, showIcon: boolean, source?: Entity_ | null): void {
		// @ts-ignore
		const effect = new $MobEffectInstance(id, duration, amplifier, ambient, visible, showIcon);
		source !== undefined && source !== null
			? entity.addEffect(effect, source)
			: entity.addEffect(effect);
	}

	public static applyEffectUntilExpired(entity: LivingEntity_, id: string, duration: integer, threshold: integer, amplifier: integer, ambient: boolean, visible: boolean, showIcon: boolean, source?: Entity_ | null): void {
		const currentEffect = entity.getEffect($BuiltInRegistries.MOB_EFFECT.getHolderOrThrow($ResourceKey.create($Registries.MOB_EFFECT, id)));
		if (currentEffect) {
			const currentDuration = currentEffect.getDuration();
			if (currentDuration > threshold) return;
		}

		this.addEffect(entity, id, duration, amplifier, ambient, visible, showIcon, source);
	}

	public static isBeingTargetedBy(victim: LivingEntity_, mob: Mob_) {
		return mob.getTarget() === victim;
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

	public static hasEffect(entity: LivingEntity_, id: string): boolean {
		const effect = $BuiltInRegistries.MOB_EFFECT.getHolderOrThrow($ResourceKey.create($Registries.MOB_EFFECT, id));
		return entity.hasEffect(effect);
	}


	public static scaleHealth(entity: LivingEntity_, newMaxHealth: number): void {
		const oldMaxHealth = entity.maxHealth;
		if (oldMaxHealth === newMaxHealth) return;

		const oldHealth = entity.health;

		const healthPercent = oldHealth / Math.max(Number.MIN_VALUE, oldMaxHealth);

		entity.maxHealth = newMaxHealth;
		entity.health = newMaxHealth * healthPercent;
	}

	public static heal(entity: LivingEntity_, healAmount: float): void {
		entity.health = MathHelper.clamped(entity.health + healAmount, 0, entity.maxHealth);
	}

	public static healPercent(entity: LivingEntity_, healPercent: float): void {
		this.heal(entity, entity.maxHealth * healPercent);
	}
}