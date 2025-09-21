let zombies = [
	"minecraft:zombie",
	"minecraft:husk",
	"minecraft:drowned",
	"minecraft:zombie_villager",
	"rottencreatures:zombie_lackey"
]

NativeEvents.onEvent($LivingDamageEvent$Post, event => {
	try {
		let victim = event.entity;
		let attacker = event.source.actual;
		if (attacker == null) return;
		// @ts-ignore
		let entitytype = $BuiltInRegistries.ENTITY_TYPE.getKey(attacker.getType()).toString()
		if (!(zombies.includes(entitytype))) {
			return;
		};
		// @ts-ignore
		LivingEntityHelper.addEffect(victim, "minecraft:slowness", 100, 0, false, true, true, attacker);
	} catch (error) {
		// bro is finally being proactive
		tellOperators(event.entity.server, `${error.message} + ${error.stack}`);
	}
});