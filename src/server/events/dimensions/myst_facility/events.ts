

namespace MystFacilityEvents {

	PlayerEvents.tick(event => {
		const player = event.player as ServerPlayer_;
		if (!isInMystFacility(player)) return;

		LivingEntityHelper.addEffect(player, "slimesurvival:adventure", 19, 0, false, false, true);

		const onCryingObsidian = player.getBlockStateOn().is($Blocks.CRYING_OBSIDIAN);
		if (onCryingObsidian) whileOnCryingObsidian(player);
	});

	const BLACKLISTED_ITEMS: string[] = [
		"minecraft:ender_pearl",
		"mutantmonsters:endersoul_hand",
		"simplyswords:shadowsting"
	];

	ItemEvents.rightClicked(event => {
		const player = event.entity;
		const flag = player instanceof $ServerPlayer && isInMystFacility(player);
		if (!flag) return;

		const stack = event.item;
		if (!BLACKLISTED_ITEMS.includes(stack.id)) return;

		event.cancel();
	});

	function isInMystFacility(player: ServerPlayer_): boolean {
		const dimension = player.level.dimension.toString();
		return dimension === "slimesurvival:myst/facility_1";
	}

	const CRYING_OBSIDIAN_DAMAGE_TS = new EntityTimestamp<ServerPlayer_>("myst.crying_obsidian.damage", 10);

	function whileOnCryingObsidian(player: ServerPlayer_): void {
		const dmgSrc = EntropyHelper.asEntropyDamageSource(player, null);
		if (player.isInvulnerableTo(dmgSrc)) return;

		if (!CRYING_OBSIDIAN_DAMAGE_TS.tryUpdate(player)) return;

		player.attack(dmgSrc, player.maxHealth);
		LivingEntityHelper.addEffect(player, "minecraft:blindness", 100, 0, false, true, true);
	}
}