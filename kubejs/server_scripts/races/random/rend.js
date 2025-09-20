EntityEvents.beforeHurt(event => {
	const victim = event.getEntity();
	if (!(victim instanceof $LivingEntity)) {
		return;
	}
	const attacker = event.getSource().getActual();
	if (!(attacker instanceof $ServerPlayer)) {
		return;
	}

	// substitute for skillhelper for now cuz im sleepy and retarded
	if (!(attacker.getTags().contains('random'))) {
		return;
	}
	LivingEntityHelper.addEffect(
		victim,
		'cataclysm:blazing_brand',
		50, 0, true, false, false,
		attacker
	);
});