/**
 * @typedef {Object} EntropyEntry
 * @property {number} damage
 * @property {string} [uuid]
 */

/**
 * 
 * @param {string} uuid
 */
function EntropyHolder(uuid) {
	this.uuid = uuid;
	/** @type {EntropyEntry[]} */
	this.entropyEntries = [];
	EntropyHolder.holders[uuid] = this;
}

/**
 * @type {Object.<string, EntropyHolder>}
 */
EntropyHolder.holders = {};

/**
 * 
 * @param {LivingEntity} entity
 * @returns {EntropyHolder | undefined}
 */
EntropyHolder.get = function(entity) {
	return EntropyHolder.holders[entity.stringUUID];
}

/**
 * 
 * @param {LivingEntity} entity 
 */
EntropyHolder.getOrCreate = function(entity) {
	let holder = EntropyHolder.get(entity);
	return holder !== undefined ? holder : new EntropyHolder(entity.stringUUID);
}

/**
 * 
 * @param {LivingEntity} entity 
 * @param {boolean} createNew
 */
EntropyHolder.tick = function(entity, createNew) {
	let holder = EntropyHolder.get(entity);
	if (holder === undefined && !createNew) {
		return;
	}
	if (holder === undefined) {
		holder = new EntropyHolder(entity.stringUUID);
	}
	holder.tick(entity);
}

/**
 * 
 * @param {float} damage 
 * @param {Entity} [attacker] 
 */
EntropyHolder.prototype.pushEntropyEntry = function(damage, attacker) {
	if (damage <= 0) {
		return;
	}
	this.entropyEntries.push({
		damage: damage,
		uuid: attacker != undefined ? attacker.stringUUID : undefined
	});
}

EntropyHolder.prototype.getTotalEntropy = function() {
	return this.entropyEntries.reduce((sum, entry) => sum + entry.damage, 0);
}

EntropyHolder.prototype.resetEntropy = function() {
	this.entropyEntries.length = 0;
}



/**
 * @param {LivingEntity} holder
 * @param {float} amount
 * @param {EntropyEntry} entry
 */
EntropyHolder.prototype.dealDamage = function(holder, amount, entry) {
	let uncertaintyDamage;
	if (entry.uuid !== undefined) {
		const attacker = holder.server.getEntityByUUID(entry.uuid);
		if (!EntropyHelper.isFromQuantumAttacker(holder, attacker)) {
			uncertaintyDamage = Math.random() * 2 * amount;
		}
		else {
			uncertaintyDamage = MathHelper.medianBiasedRandom(0, 2.0, 1.25) * amount;
		}
	}
	else {
		uncertaintyDamage = Math.random() * 2 * amount;
	}

	let newHealth = holder.getHealth() - uncertaintyDamage;

	if (newHealth > 0) {
		holder.setHealth(newHealth);
	}
	else {
		holder.kill();
	}
}

/**
 * 
 * @param {LivingEntity} holder 
 * @returns 
 */
EntropyHolder.prototype.tick = function(holder) {
	let player = holder instanceof $Player ? holder : null;
	if (player != null) {
		let entropyDisplay = `{"color":"dark_purple","text":"Entropy: ${this.getTotalEntropy().toFixed(2)}"}`;
		ActionbarManager.addText(player, entropyDisplay);
	}

	if (this.entropyEntries.length <= 0) {
		return;
	}

	let entropyInterval = EntropyHelper.getInterval(holder);
	if (TickHelper.getGameTime(holder.server) - holder.persistentData.getLong("last_entropy_tick") < entropyInterval) {
		return;
	}

	this.tickEntries(holder);

	CommandHelper.runCommandSilent(holder.server,
		`execute in ${holder.level.dimension.toString()} positioned ${holder.x} ${holder.y} ${holder.z} run particle minecraft:soul ~ ~${holder.eyeHeight * 0.5} ~ 0.3 0.3 0.3 0.1 1 force @a[distance=..64]`
	);

	if (holder instanceof $ServerPlayer && EntropyHelper.isFarlander(holder)) {
		this.tryPlayFarlanderHurtSound(holder);
		if (this.entropyEntries.length <= 0) {
			this.tryPlayFarlanderFullDecaySound(holder);
		}
	}

	holder.persistentData.putLong("last_entropy_tick", TickHelper.getGameTime(holder.server));
}

/**
 * @param {LivingEntity} holder
 */
EntropyHolder.prototype.tickEntries = function(holder) {
	// walk backwards to avoid skipping entries when splicing off entries
	for (let i = this.entropyEntries.length - 1; i >= 0; i--) {
		let entry = this.entropyEntries[i];
		let entropyDecay = this.decayEntry(holder, entry, i);
		this.dealDamage(holder, entropyDecay, entry);
	}
}

/**
 * @param {ServerPlayer} player 
 */
EntropyHolder.prototype.tryPlayFarlanderHurtSound = function(player) {
	if (!TickHelper.timestamp(player, "last_entropy_hurt_sound_tick", 5)) {
		return;
	}

	playsound(player.level, player.position(), "minecraft:entity.enderman.hurt", "record", 1, 1.25);
}

/**
 * @param {ServerPlayer} player 
 */
EntropyHolder.prototype.tryPlayFarlanderFullDecaySound = function(player) {
	playsound(player.level, player.position(), "minecraft:entity.enderman.death", "record", 1, 2);
}

/**
 * @param {LivingEntity} holder
 * @param {EntropyEntry} entry
 * @param {integer} index
 */
EntropyHolder.prototype.decayEntry = function(holder, entry, index) {
	if (entry.damage > 0.5) {
		let entropyDecay = entry.damage * 0.1;
		entry.damage -= entropyDecay;
		return entropyDecay
	}
	else {
		let entropyDecay = entry.damage;
		this.entropyEntries.splice(index, 1);
		return entropyDecay;
	}
}