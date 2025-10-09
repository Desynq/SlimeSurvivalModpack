NativeEvents.onEvent($LivingDamageEvent$Post, event => {
	const victim = event.entity;
	const attacker = event.source.actual;
	if (!(attacker instanceof $Slime && attacker.type === "minecraft:slime")) {
		return;
	}

	const amplifier = Math.max(0, attacker.size - 3);
	LivingEntityHelper.addEffect(victim, "minecraft:poison", 100, amplifier, false, true, true, attacker as any);
});

EntityEvents.death("minecraft:slime", event => {
	const entity = event.entity;
	if (!(entity instanceof $Slime) || entity.size > 1) {
		return;
	}

	const nbt = {
		Radius: 1,
		Duration: 100,
		potion_contents: {
			potion: "oozing",
			custom_effects: [
				{
					id: "poison",
					duration: 100,
					amplifier: 0,
					show_particles: true,
					show_icon: true
				}
			]
		}
	};
	CommandHelper.runCommandSilent(entity.level, `summon area_effect_cloud ${entity.x} ${entity.y} ${entity.z} ${JSON.stringify(nbt)}`);
});