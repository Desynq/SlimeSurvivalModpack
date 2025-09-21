NativeEvents.onEvent($LivingDamageEvent$Post, event => {
	let victim = event.entity;
	let attacker = event.source.actual;
	if (!(attacker instanceof $Slime && attacker.type === "minecraft:slime")) {
		return;
	}

	let amplifier = Math.max(0, attacker.size - 3);
	// @ts-ignore
	LivingEntityHelper.addEffect(victim, "minecraft:poison", 100, amplifier, false, true, true, attacker);
});

EntityEvents.death("minecraft:slime", event => {
	let entity = event.entity;
	if (!(entity instanceof $Slime) || entity.size > 1) {
		return;
	}

	let nbt = {
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
	CommandHelper.runCommandSilent(entity.level, `summon area_effect_cloud ${entity.x} ${entity.y} ${entity.z} ${JsonIO.toString(nbt)}`);
});