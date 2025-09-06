StartupEvents.registry("mob_effect", event => {
	event.create("slimesurvival:pinged")
		.color(Color.DARK_AQUA)
		.harmful()
		.effectTick((entity, amplifier) => global.EffectTick.Pinged(entity, amplifier))
		.displayName(Component.darkAqua("Pinged"));

	event.create("slimesurvival:weak_knees")
		.color(Color.DARK_GRAY)
		.harmful()
		.effectTick((entity, amplifier) => global.EffectTick.WeakKnees(entity, amplifier))
		.displayName(Component.darkGray("Weak Knees"));
});



global.EffectTick = {};

global.EffectTick.Pinged = function(entity, amplifier) {
	
}

global.EffectTick.WeakKnees = function(entity, amplifier) {
	
}