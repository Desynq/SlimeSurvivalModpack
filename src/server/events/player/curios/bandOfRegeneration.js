PlayerEvents.tick(event => {
	let player = event.player;
	if (!(player instanceof $ServerPlayer)) {
		return;
	}

	if (!PlayerHelper.canHeal(player)) {
		return;
	}

	// @ts-ignore
	let item = $BuiltInRegistries.ITEM.get($ResourceLocation.parse("slimesurvival:band_of_regeneration"));
	let hasBandOfRegeneration = player.isCuriosEquipped(item);

	if (!hasBandOfRegeneration) {
		return;
	}

	if (!TickHelper.tryUpdateTimestamp(player, "band_of_regeneration_cooldown", 20)) {
		return;
	}

	let newHealth = Math.min(player.maxHealth, player.health + 1);
	player.setHealth(newHealth);
});