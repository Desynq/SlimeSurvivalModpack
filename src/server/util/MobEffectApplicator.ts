// priority: 1000

class MobEffectApplicator {

	protected constructor(
		public readonly effectId: string,
		public readonly duration: integer = 0,
		public readonly amplifier: integer = 0,
		public readonly ambient: boolean = false,
		public readonly visible: boolean = true,
		public readonly showIcon: boolean = true,
		public readonly rules = new MobEffectRules()
	) { }

	public static of(effectId: string): MobEffectApplicator {
		return new MobEffectApplicator(effectId);
	}

	/**
	 * @returns Whether the entity has the effect id. Accepts any amplifier.
	 */
	public hasSameId(entity: LivingEntity_): boolean {
		return LivingEntityHelper.hasEffect(entity, this.effectId);
	}

	public hasSameAmplifier(entity: LivingEntity_): boolean {
		const effect = LivingEntityHelper.getEffect(entity, this.effectId);
		return effect?.amplifier === this.amplifier;
	}

	/**
	 * @returns `true` if the player has an effect with the same id and amplifier with a duration less than or equal to the applicator's duration
	 */
	public hasExact(entity: LivingEntity_): boolean {
		const effect = LivingEntityHelper.getEffect(entity, this.effectId);
		return effect && effect.amplifier === this.amplifier && effect.duration <= this.duration;
	}

	/**
	 * Removes the effect if its duration is less than or equal to the configured duration and amplifier is the same
	 */
	public remove(entity: LivingEntity_, maxDuration?: number): boolean {
		maxDuration ??= this.duration;
		const effect = LivingEntityHelper.getEffect(entity, this.effectId);
		if (effect === null || effect.duration > maxDuration || effect.amplifier !== this.amplifier) return false;

		LivingEntityHelper.removeEffect(entity, this.effectId);
		return true;
	}


	protected withRulesObj(rules: MobEffectRules): MobEffectApplicator {
		return new MobEffectApplicator(this.effectId, this.duration, this.amplifier, this.ambient, this.visible, this.showIcon, rules);
	}

	public withRules(minDuration?: integer, maxDuration?: integer, minAmplifier?: integer, maxAmplifier?: integer): MobEffectApplicator {
		return this.withRulesObj(new MobEffectRules(minDuration, maxDuration, minAmplifier, maxAmplifier));
	}

	public withDuration(duration: integer): MobEffectApplicator {
		duration = this.rules.clampDuration(duration);
		return this.copy({ duration });
	}

	public withAmplifier(amplifier: integer): MobEffectApplicator {
		amplifier = this.rules.clampAmplifier(amplifier);
		return this.copy({ amplifier });
	}

	public withAmbience(ambient: boolean): MobEffectApplicator {
		return new MobEffectApplicator(this.effectId, this.duration, this.amplifier, ambient, this.visible, this.showIcon, this.rules);
	}

	public withVisibility(visible?: boolean, showIcon?: boolean): MobEffectApplicator {
		return new MobEffectApplicator(this.effectId, this.duration, this.amplifier, this.ambient, visible ?? this.visible, showIcon ?? this.showIcon, this.rules);
	}

	public apply(entity: LivingEntity_, source?: Entity_): this {
		LivingEntityHelper.addEffect(entity, this.effectId, this.duration, this.amplifier, this.ambient, this.visible, this.showIcon, source);
		return this;
	}

	protected copy(changes: Partial<MobEffectApplicator>): MobEffectApplicator {
		return new MobEffectApplicator(
			changes.effectId ?? this.effectId,
			changes.duration ?? this.duration,
			changes.amplifier ?? this.amplifier,
			changes.ambient ?? this.ambient,
			changes.visible ?? this.visible,
			changes.showIcon ?? this.showIcon,
			changes.rules ?? this.rules
		);
	}
}

class MobEffectRules {
	public constructor(
		public readonly minDuration?: integer,
		public readonly maxDuration?: integer,
		public readonly minAmplifier?: integer,
		public readonly maxAmplifier?: integer
	) { }

	public clampDuration(duration: integer): integer {
		return this.clamp(duration, this.minDuration, this.maxDuration);
	}

	public clampAmplifier(amplifier: integer): integer {
		return this.clamp(amplifier, this.minAmplifier, this.maxAmplifier);
	}

	private clamp(value: integer, min?: integer, max?: integer) {
		if (min !== undefined && value < min) return min;
		if (max !== undefined && value > max) return max;
		return value;
	}
}