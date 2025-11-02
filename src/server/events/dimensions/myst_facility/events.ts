

namespace MystFacilityEvents {

	EntityEvents.checkSpawn(event => {
		if (MystHelper.isMystLevel(event.level)) return;
		if (event.type.toString() !== "NATURAL") return;
		event.cancel();
	});

	PlayerEvents.tick(event => {
		const player = event.player as ServerPlayer_;

		tryTeleportIntoMyst(player);

		if (MystHelper.isInMystFacility(player)) tickMystFacilityPlayer(player);
	});

	ItemEvents.rightClicked(event => {
		const player = event.entity;
		const flag = player instanceof $ServerPlayer && MystHelper.isInMystFacility(player);
		if (!flag) return;

		const stack = event.item;
		if (!BLACKLISTED_ITEMS.includes(stack.id)) return;

		event.cancel();
	});


	function tryTeleportIntoMyst(player: ServerPlayer_): void {
		if (!EntityHelper.isInOverworld(player)) return;

		if (!MystHelper.isMystPortalOpen(player.server)) return;

		if (player.y > -96) return;

		PlayerHelper.teleportTo(player, MystHelper.getLevel(player.server), -179.5, 11, 5.5, 0, 90);
	}



	const BLACKLISTED_ITEMS: string[] = [
		"minecraft:ender_pearl",
		"mutantmonsters:endersoul_hand",
		"simplyswords:shadowsting"
	];

	function tickMystFacilityPlayer(player: ServerPlayer_): void {
		LivingEntityHelper.addEffect(player, "slimesurvival:adventure", 19, 0, false, false, true);

		const onCryingObsidian = player.getBlockStateOn().is($Blocks.CRYING_OBSIDIAN);
		if (onCryingObsidian) whileOnCryingObsidian(player);

		const inStructureVoid = player.getInBlockState().is($Blocks.STRUCTURE_VOID);
		if (inStructureVoid) whileInStructureVoid(player);
	}




	function isImmuneToEnvironment(player: ServerPlayer_): boolean {
		// time since death check is to prevent death loops from lagging server and spamming chat
		return player.invulnerable || player.abilities.invulnerable || player.stats.timeSinceDeath < 20;
	}

	const cryingObsidianDamageCooldown = new EntityTimestamp<ServerPlayer_>("myst.crying_obsidian.damage", 10);

	function whileOnCryingObsidian(player: ServerPlayer_): void {
		if (isImmuneToEnvironment(player)) return;

		if (!cryingObsidianDamageCooldown.hasElapsed(player)) return;

		const hurt = EntropyHelper.attackWithEntropy(player, null, player.maxHealth);
		if (hurt) {
			cryingObsidianDamageCooldown.update(player);
			LivingEntityHelper.addEffect(player, "minecraft:blindness", 100, 0, false, true, true);
			LivingEntityHelper.addEffect(player, "slimesurvival:weak_knees", 100, 0, false, true, true);
		}
	}

	function whileInStructureVoid(player: ServerPlayer_): void {
		if (isImmuneToEnvironment(player)) return;

		player.kill();
	}
}