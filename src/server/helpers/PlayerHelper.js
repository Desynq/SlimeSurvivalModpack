const PlayerHelper = {}



/**
 * 
 * @param {Player_} player 
 */
PlayerHelper.isSurvivalLike = function(player) {
	return !player.creative && !player.spectator;
}

/**
 * @param {Player_} player
 */
PlayerHelper.isOperator = function(player) {
	return player.permissionLevel >= 2;
}



/**
 * @param {MinecraftServer_} server
 * @param {import("java.util.UUID").$UUID$$Original | null} uuid
 */
PlayerHelper.isOnWhitelist = function(server, uuid) {
	return server
		.getPlayerList()
		.getWhiteList()
		.getEntries()
		.stream()
		.anyMatch(entry => entry
			.getUser()
			.getId()
			.equals(uuid)
		);
}



/**
 * 
 * @param {ServerPlayer_} player 
 * @returns {import("net.minecraft.world.entity.TamableAnimal").$TamableAnimal$$Original[]}
 */
PlayerHelper.getPetsFollowing = function(player) {
	return player.getLevel().getEntities()
		.stream()
		.filter(e => e instanceof $TamableAnimal && !e.isInSittingPose() && e.getOwner() == player)
		.toArray()
}

/**
 * 
 * @param {ServerPlayer_} player 
 * @param {string} itemId 
 */
PlayerHelper.hasCuriosEquipped = function(player, itemId) {
	const item = $BuiltInRegistries.ITEM.get(itemId);
	return player.isCuriosEquipped(item);
}

/**
 * @param {ServerPlayer_} player 
 */
PlayerHelper.shouldBeAbleToHeal = function(player) {
	return player.health > 0 && player.health < player.maxHealth && !player.isDeadOrDying();
}



PlayerHelper.wasLastFallFlying = (function() {
	/** @type {Object.<string, long | undefined>} */
	const timestamps = {};

	/**
	 * 
	 * @param {ServerPlayer_} player 
	 * @param {long} ticks
	 */
	function wasLastFallFlying(player, ticks) {
		const timestamp = timestamps[player.stringUUID];
		if (timestamp == undefined) {
			return false;
		}
		return TickHelper.getGameTime(player.server) - timestamp <= ticks;
	}

	PlayerEvents.tick(event => {
		if (event.player.isFallFlying()) {
			timestamps[event.player.stringUUID] = TickHelper.getGameTime(event.player.server);
		}
	})

	return wasLastFallFlying;
})();