let skeletons = [
	"minecraft:skeleton",
	"rottencreatures:skeleton_lackey",
]

NativeEvents.onEvent($LivingDamageEvent$Post, event => {
	try {
		let victim = event.entity;
		let attacker = event.source.actual;
		if (attacker == null) return;
		// 
		if (event.getNewDamage() == 0) return;
		let entityType = $BuiltInRegistries.ENTITY_TYPE.getKey(attacker.getEntityType()).toString();
		if (!(skeletons.includes(entityType))) {
			return;
		};
		// @ts-ignore
		LivingEntityHelper.addEffect(victim, "slimesurvival:weak_knees", 100, 0, false, true, true, attacker);
	} catch (error) {
		// bro is finally being proactive
		tellError(event.entity.server, error);
	}
});