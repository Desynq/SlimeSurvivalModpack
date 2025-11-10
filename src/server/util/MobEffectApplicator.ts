// priority: 1000

class MobEffectApplicator {

	private constructor(
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

	private withRulesObj(rules: MobEffectRules): MobEffectApplicator {
		return new MobEffectApplicator(this.effectId, this.duration, this.amplifier, this.ambient, this.visible, this.showIcon, rules);
	}

	public withRules(minDuration?: integer, maxDuration?: integer, minAmplifier?: integer, maxAmplifier?: integer): MobEffectApplicator {
		return this.withRulesObj(new MobEffectRules(minDuration, maxDuration, minAmplifier, maxAmplifier));
	}

	public withDuration(ticks: integer): MobEffectApplicator {
		ticks = this.rules.clampDuration(ticks);

		return new MobEffectApplicator(this.effectId, ticks, this.amplifier, this.ambient, this.visible, this.showIcon, this.rules);
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

	private copy(changes: Partial<MobEffectApplicator>): MobEffectApplicator {
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