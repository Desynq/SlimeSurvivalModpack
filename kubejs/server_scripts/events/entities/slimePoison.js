/** @type {typeof import("net.neoforged.neoforge.event.entity.living.LivingDamageEvent$Post").$LivingDamageEvent$Post } */
let $LivingDamageEvent$Post = Java.loadClass("net.neoforged.neoforge.event.entity.living.LivingDamageEvent$Post")

NativeEvents.onEvent($LivingDamageEvent$Post, event => {
	const victim = event.entity;
	const attacker = event.source.actual;
	if (!(attacker instanceof $Slime)) {
		return;
	}

	const amplifier = Math.max(0, attacker.size - 3);
	// @ts-ignore
	LivingEntityHelper.addEffect(victim, "minecraft:poison", 100, amplifier, false, true, true, attacker);
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
	CommandHelper.runCommandSilent(entity.level, `summon area_effect_cloud ${entity.x} ${entity.y} ${entity.z} ${JsonIO.toString(nbt)}`);
});