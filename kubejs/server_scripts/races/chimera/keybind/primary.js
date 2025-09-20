
const ChimeraPrimaryAbility = (function() {

	/**
	 * 
	 * @param {ServerPlayer} player 
	 */
	function onPress(player) {
		player.tell("bro pressed his ability button");
	}

	return {
		onPress: onPress
	}
})();