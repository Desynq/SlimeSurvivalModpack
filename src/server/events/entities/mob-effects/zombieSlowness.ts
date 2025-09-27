
namespace ZombieSlowness {
	const zombies = [
		"minecraft:zombie",
		"minecraft:husk",
		"minecraft:drowned",
		"minecraft:zombie_villager",
		"rottencreatures:zombie_lackey"
	];

	NativeEvents.onEvent($LivingDamageEvent$Post, event => {
		try {
			let victim = event.entity;
			let attacker = event.source.actual;
			if (attacker == null) return;
			if (event.getNewDamage() == 0) return; // checks for shield blocking
			// @ts-ignore
			let attackerEntityType: string = $BuiltInRegistries.ENTITY_TYPE.getKey(attacker.getType()).toString();
			if (!(zombies.includes(attackerEntityType))) {
				return;
			};
			// @ts-ignore
			LivingEntityHelper.addEffect(victim, "minecraft:slowness", 100, 0, false, true, true, attacker);
		} catch (error) {
			if (error instanceof Error) {
				tellOperators(event.entity.server, `${error.message} + ${error.stack}`);
			}
		}
	});
}