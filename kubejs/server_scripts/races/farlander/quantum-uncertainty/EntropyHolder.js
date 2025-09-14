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
 * @param {float} damage 
 * @param {Entity} [attacker] 
 */
EntropyHolder.prototype.pushEntropyEntry = function(damage, attacker) {
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
 * @param {LivingEntity} entity
 * @param {float} amount
 */
EntropyHolder.prototype.dealDamage = function(entity, amount) {
	let uncertaintyDamage = Math.random() * 2 * amount;
	let newHealth = entity.getHealth() - uncertaintyDamage;
	if (newHealth > 0) {
		entity.setHealth(newHealth);
	}
	else {
		entity.kill();
	}
}

/**
 * 
 * @param {LivingEntity} entity 
 * @returns 
 */
EntropyHolder.prototype.tick = function(entity) {
	let player = entity instanceof $Player ? entity : null;
	if (player != null) {
		let entropyDisplay = `{"color":"dark_purple","text":"Entropy: ${this.getTotalEntropy().toFixed(2)}"}`;
		ActionbarManager.addText(player, entropyDisplay);
	}

	if (this.entropyEntries.length <= 0) {
		return;
	}

	let totalEntropyDecay = 0;
	this.entropyEntries.forEach((entry, i) => {
		let entropyDecay = entry.damage * 0.1;

		entry.damage -= entropyDecay;
		if (entry.damage < 0.5) {
			totalEntropyDecay += entry.damage;
			delete this.entropyEntries[i];
		}
		else {
			totalEntropyDecay += entropyDecay;
		}
	});

	this.dealDamage(entity, totalEntropyDecay);
}