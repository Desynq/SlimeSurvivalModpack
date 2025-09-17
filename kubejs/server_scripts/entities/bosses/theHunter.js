const TheHunter = {};

/**
 * @param {ServerPlayer} boss
 */
TheHunter.tick = function(boss) {
	boss.level.getPlayers()
		.stream()
		.filter(/** @param {ServerPlayer} p */ p => !p.tags.contains("boss.the_hunter") && !p.isCrouching() && PlayerHelper.isSurvivalLike(p))
		.forEach(p => {
			// @ts-ignore
			LivingEntityHelper.addEffect(p, "minecraft:glowing", 20, 0, false, true, true, boss);
		})
}

NativeEvents.onEvent($LivingIncomingDamageEvent, event => {
	const entity = event.getEntity();
	if (!(entity instanceof $ServerPlayer && entity.tags.contains("boss.the_hunter"))) {
		return;
	}

	if (event.source.type().msgId() === "fall") {
		event.setCanceled(true);
		return;
	}
});

EntityEvents.death("minecraft:player", event => {
	const player = event.player;

	if (!PlayerHelper.isSurvivalLike(player)) {
		return;
	}

	player.getLevel().getPlayers()
		.stream()
		.filter(p => p instanceof $ServerPlayer && p.tags.contains("boss.the_hunter"))
		.forEach(/** @param {ServerPlayer} p */ p => p.setHealth(Math.min(p.maxHealth, p.health + 25)))
});