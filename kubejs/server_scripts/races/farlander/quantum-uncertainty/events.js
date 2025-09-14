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

	// @ts-ignore
	let holder = EntropyHolder.get(victim);
	if (holder == undefined) {
		holder = new EntropyHolder(victim.stringUUID);
	}

	if (attackerHasQuantumRending) {
		let damagePercentage = EntropyHelper.getEntropyPercentageFromAttacker(victim, attacker);
		// @ts-ignore
		holder.pushEntropyEntry(postAbsorptionDamage * damagePercentage, attacker);
		event.setDamage(postAbsorptionDamage * (1 - damagePercentage));
	}
	// Farlander vs. Farlander results in double dipping because why not
	if (isFarlander(victim)) {
		// @ts-ignore
		holder.pushEntropyEntry(postAbsorptionDamage, attacker);
		event.setDamage(0);
	}
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
	if (entity == null) {
		return;
	}

	// @ts-ignore
	let holder = EntropyHolder.get(entity);
	if (holder == undefined) {
		return;
	}
	/** @ts-ignore */
	holder.tick(entity);
})

PlayerEvents.respawned(event => {
	// @ts-ignore
	let holder = EntropyHolder.get(event.player);
	if (holder == undefined) {
		return;
	}
	holder.resetEntropy();
});