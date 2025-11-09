

namespace LootBagEvents {

	ItemEvents.rightClicked(event => {
		const player = event.player as ServerPlayer_;
		const stack = event.item;
		LootBags.tryOpen(player, stack);
	});
}