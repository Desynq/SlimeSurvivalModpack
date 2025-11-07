// priority: 1000

class MobEffectApplicator {

	private constructor(
		public readonly effectId: string,
		public readonly duration: integer,
		public readonly amplifier: integer,
		public readonly ambient: boolean = false,
		public readonly visible: boolean = true,
		public readonly showIcon: boolean = true,
		public readonly rules = new MobEffectRules()
	) { }

	public static of(effectId: string): MobEffectApplicator {
		return new MobEffectApplicator(effectId, 0, 0);
	}

	private withRulesObj(rules: MobEffectRules): MobEffectApplicator {
		return new MobEffectApplicator(this.effectId, this.duration, this.amplifier, this.ambient, this.visible, this.showIcon, rules);
	}

	public withRules(minDuration?: integer, maxDuration?: integer, minAmplifier?: integer, maxAmplifier?: integer): MobEffectApplicator {
		return this.withRulesObj(new MobEffectRules(minDuration, maxDuration, minAmplifier, maxAmplifier));
	}

	public withDuration(duration: integer): MobEffectApplicator {
		duration = this.rules.clampDuration(duration);

		return new MobEffectApplicator(this.effectId, duration, this.amplifier, this.ambient, this.visible, this.showIcon);
	}

	public withAmplifier(amplifier: integer): MobEffectApplicator {
		amplifier = this.rules.clampAmplifier(amplifier);

		return new MobEffectApplicator(this.effectId, this.duration, amplifier, this.ambient, this.visible, this.showIcon);
	}

	public apply(entity: LivingEntity_, source?: Entity_): this {
		LivingEntityHelper.addEffect(entity, this.effectId, this.duration, this.amplifier, this.ambient, this.visible, this.showIcon, source);
		return this;
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