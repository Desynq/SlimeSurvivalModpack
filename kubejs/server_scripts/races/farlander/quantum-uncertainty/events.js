


EntityEvents.beforeHurt(event => {
	let entity = event.entity;

	// @ts-ignore
	if (!isFarlander(entity) && !isDamageFromFarlander(entity, event.source.actual)) {
		return;
	}
	if (isFromKillCommand(event)) {
		return;
	}

	let newAbsorptionValue = entity.absorptionAmount - event.damage;
	entity.setAbsorptionAmount(newAbsorptionValue);
	let postAbsorptionDamage = -Math.min(newAbsorptionValue, 0);

	// @ts-ignore
	let holder = EntropyHolder.get(entity) ?? new EntropyHolder(entity.stringUUID);

	// @ts-ignore
	holder.pushEntropyEntry(postAbsorptionDamage, entity);
	event.setDamage(0);
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
 * @param {LivingEntity} victim 
 * @param {Entity} attacker 
 */
// @ts-ignore
function isDamageFromFarlander(victim, attacker) {
	return false;
}

/**
 * 
 * @param {import("dev.latvian.mods.kubejs.entity.BeforeLivingEntityHurtKubeEvent").$BeforeLivingEntityHurtKubeEvent$$Original} event 
 */
function isFromKillCommand(event) {
	return event.source.type().msgId() === "genericKill";
}



PlayerEvents.tick(event => {
	// @ts-ignore
	let holder = EntropyHolder.get(event.player);
	if (holder == undefined) {
		return;
	}
	/** @ts-ignore */
	holder.tick(event.player);
});

PlayerEvents.respawned(event => {
	// @ts-ignore
	let holder = EntropyHolder.get(event.player);
	if (holder == undefined) {
		return;
	}
	holder.resetEntropy();
});