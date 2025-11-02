

namespace BeeQueenArmor {

	PlayerEvents.tick(event => {
		const player = event.getPlayer() as ServerPlayer_;
		const armor = player.getArmorSlots();
		let piecesEquipped = 0;
		armor.forEach(stack => {
			piecesEquipped += StackHelper.isCustomFlagSet(stack, "bee_queen_armor") ? 1 : 0;
		});
		if (piecesEquipped === 0) return;
		// const amplifier = piecesEquipped - 1;
		const amplifier = Math.floor((piecesEquipped - 1) / 2);
		LivingEntityHelper.applyEffectUntilExpired(player, "minecraft:regeneration", 100, 20, amplifier, false, true, true, player);
	});
}