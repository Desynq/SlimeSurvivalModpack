

const PlayerEntropy = (function() {
	const MIN_ENTROPY = 0.05;

	/**
	 * 
	 * @param {float} amount 
	 */
	function validateEntropy(amount) {
		if (amount == null || !isFinite(amount) || amount < MIN_ENTROPY) {
			return 0;
		}
		return amount;
	}

	/**
	 * 
	 * @param {Player} player 
	 */
	function getEntropy(player) {
		let amount = player.persistentData.getFloat("entropy");
		return validateEntropy(amount);
	}

	/**
	 * 
	 * @param {Player} player 
	 * @param {float} amount 
	 */
	function setEntropy(player, amount) {
		validateEntropy(amount);
		player.persistentData.putFloat("entropy", amount);
	}

	/**
	 * 
	 * @param {Player} player 
	 * @param {float} amount 
	 */
	function addEntropy(player, amount) {
		setEntropy(player, getEntropy(player) + amount);
	}

	/**
	 * 
	 * @param {Player} player 
	 */
	function hasEntropy(player) {
		return getEntropy(player) > 0;
	}

	/**
	 * 
	 * @param {Player} player 
	 */
	function getEntropyModifier(player) {
		return 0.1;
	}

	/**
	 * Deals entropy damage to the player's health
	 * @param {Player} player 
	 * @param {float} entropyAmount 
	 */
	function dealEntropy(player, entropyAmount) {
		if (!isFinite(player.health)) {
			player.health = 0;
		}
		const uncertaintyDamage = Math.random() * 2 * entropyAmount;
		const newHealth = player.getHealth() - uncertaintyDamage;
		if (newHealth > 0) {
			player.setHealth(newHealth);
		}
		else {
			player.kill();
		}
	}

	/**
	 * 
	 * @param {Player} player 
	 */
	function tickEntropy(player) {
		const entropyLoss = getEntropy(player) * getEntropyModifier(player);
		addEntropy(player, -entropyLoss);
		dealEntropy(player, entropyLoss);
		if (hasEntropy(player)) {
			const entropyDisplay = `{"color":"dark_purple","text":"Entropy: ${getEntropy(player).toFixed(2)}"}`;
			ActionbarManager.addText(player, entropyDisplay);
		}
	}



	return {
		MIN_ENTROPY: MIN_ENTROPY,
		getEntropy: getEntropy,
		addEntropy: addEntropy,
		tickEntropy: tickEntropy,
	}
})();