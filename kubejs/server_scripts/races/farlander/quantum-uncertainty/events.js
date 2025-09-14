/** @type {typeof import("net.neoforged.neoforge.event.tick.EntityTickEvent$Pre").$EntityTickEvent$Pre } */
let $EntityTickEvent$Pre = Java.loadClass("net.neoforged.neoforge.event.tick.EntityTickEvent$Pre")
/** @type {typeof import("net.neoforged.neoforge.event.tick.EntityTickEvent").$EntityTickEvent } */
let $EntityTickEvent = Java.loadClass("net.neoforged.neoforge.event.tick.EntityTickEvent")



EntityEvents.beforeHurt(event => {
	let victim = event.entity;
	let attacker = event.source.actual;

	if (!(victim instanceof $LivingEntity)) {
		return;
	}

	let attackerHasQuantumRending = EntropyHelper.isFromQuantumAttacker(victim, attacker);
	if (!isFarlander(victim) && !attackerHasQuantumRending) {
		return;
	}
	if (isFromKillCommand(event)) {
		return;
	}

	let newAbsorptionValue = victim.absorptionAmount - event.damage;
	victim.setAbsorptionAmount(newAbsorptionValue);
	let postAbsorptionDamage = -Math.min(newAbsorptionValue, 0);

	let holder = EntropyHolder.getOrCreate(victim);

	let rendingPercentage = attackerHasQuantumRending
		? EntropyHelper.getEntropyPercentageFromAttacker(victim, attacker)
		: 0;

	if (rendingPercentage > 0) {
		let rendingDamage = postAbsorptionDamage * rendingPercentage;
		holder.pushEntropyEntry(rendingDamage, attacker);
		postAbsorptionDamage -= rendingDamage;
	}
	if (isFarlander(victim)) {
		holder.pushEntropyEntry(postAbsorptionDamage, attacker);
		postAbsorptionDamage = 0;
	}
	event.setDamage(postAbsorptionDamage);
});

/**
 * @param {LivingEntity} victim 
 */
function isFarlander(victim) {
	if (!(victim instanceof $ServerPlayer)) {
		return false;
	}
	if (!SkillHelper.hasSkill(victim, FarlanderSkills.QUANTUM_UNCERTAINTY)) {
		return false;
	}
	return true;
}

/**
 * 
 * @param {import("dev.latvian.mods.kubejs.entity.BeforeLivingEntityHurtKubeEvent").$BeforeLivingEntityHurtKubeEvent$$Original} event 
 */
function isFromKillCommand(event) {
	return event.source.type().msgId() === "genericKill";
}


NativeEvents.onEvent($EntityTickEvent$Pre, event => {
	let entity = event.entity instanceof $LivingEntity ? event.entity : null;
	if (entity === null) {
		return;
	}

	EntropyHolder.tick(entity, false);
})

PlayerEvents.respawned(event => {
	// @ts-ignore
	let holder = EntropyHolder.get(event.player);
	if (holder === undefined) {
		return;
	}
	holder.resetEntropy();
});