


namespace BlindnessEffectHandler {

	const MODIFIER_KEY = "blindness_debuff";

	NativeEvents.onEvent($MobEffectEvent$Added, event => {
		const effect = event.getEffectInstance();
		if (!effect || !effect.is($MobEffects.BLINDNESS)) return;

		const entity = event.getEntity();
		AttributeHelper.addModifier(entity, "minecraft:generic.follow_range", MODIFIER_KEY, -0.75, "add_multiplied_total");
	});

	NativeEvents.onEvent($MobEffectEvent$Remove, event => {
		const effect = event.getEffectInstance();
		if (!effect || effect.is($MobEffects.BLINDNESS)) return;

		const entity = event.getEntity();
		AttributeHelper.removeModifier(entity, "minecraft:generic.follow_range", MODIFIER_KEY);
	});
}