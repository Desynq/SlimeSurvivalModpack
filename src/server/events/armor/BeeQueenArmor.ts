

namespace BeeQueenArmor {

	PlayerEvents.tick(event => {
		const player = event.getPlayer() as ServerPlayer_;
		const armor = player.getArmorSlots();
		let regenLevel = 0;
		armor.forEach(stack => {
			regenLevel += ItemHelper.isCustomFlagSet(stack, "bee_queen_armor") ? 1 : 0;
		});
		if (regenLevel === 0) return;
		LivingEntityHelper.applyEffectUntilExpired(player, "minecraft:regeneration", 100, 20, regenLevel - 1, false, true, true, player);
	});
}