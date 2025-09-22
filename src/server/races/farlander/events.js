/** @type {typeof import("net.neoforged.neoforge.event.tick.EntityTickEvent$Pre").$EntityTickEvent$Pre } */
let $EntityTickEvent$Pre = Java.loadClass("net.neoforged.neoforge.event.tick.EntityTickEvent$Pre")
/** @type {typeof import("net.neoforged.neoforge.event.tick.EntityTickEvent").$EntityTickEvent } */
let $EntityTickEvent = Java.loadClass("net.neoforged.neoforge.event.tick.EntityTickEvent")



EntityEvents.beforeHurt(event => {
	const victim = event.entity;
	const attacker = event.source.actual;

	if (!(victim instanceof $LivingEntity)) {
		return;
	}

	const attackerHasQuantumRending = EntropyHelper.isFromQuantumAttacker(victim, attacker);
	const isFarlander = victim instanceof $ServerPlayer && EntropyHelper.isFarlander(victim);
	if (!isFarlander && !attackerHasQuantumRending) {
		return;
	}

	const blacklistedDamageSources = ["genericKill", "slimesurvival.entropy"]
	if (ArrayHelper.includes(blacklistedDamageSources, event.source.getType())) {
		return;
	}

	let postAbsorptionDamage = applyAbsorptionDamage(victim, event.damage);

	const holder = EntropyHolder.getOrCreate(victim);

	let rendingPercentage = attackerHasQuantumRending
		? EntropyHelper.getEntropyPercentageFromAttacker(victim, attacker)
		: 0;

	if (rendingPercentage > 0) {
		let rendingDamage = postAbsorptionDamage * rendingPercentage;
		holder.pushEntropyEntry(rendingDamage, attacker);
		postAbsorptionDamage -= rendingDamage;
	}
	if (isFarlander) {
		holder.pushEntropyEntry(postAbsorptionDamage, attacker);
		postAbsorptionDamage = 0;
	}
	event.setDamage(postAbsorptionDamage);
});

/**
 * 
 * @param {LivingEntity} victim 
 * @param {float} damage 
 */
function applyAbsorptionDamage(victim, damage) {
	const newAbsorptionValue = victim.absorptionAmount - damage;
	victim.setAbsorptionAmount(newAbsorptionValue);
	return -Math.min(newAbsorptionValue, 0);
}


NativeEvents.onEvent($EntityTickEvent$Pre, event => {
	const entity = event.entity instanceof $LivingEntity ? event.entity : null;
	if (entity === null) {
		return;
	}

	EntropyHolder.tick(entity, false);
})

PlayerEvents.respawned(event => {
	const holder = EntropyHolder.get(event.player);
	if (holder === undefined) {
		return;
	}
	holder.resetEntropy();
});

EntityEvents.death(event => {
	if (event.getSource().getType() !== "slimesurvival.entropy") {
		return;
	}

	let attacker = event.getSource().getActual();
	if (!attacker) {
		return;
	}
});