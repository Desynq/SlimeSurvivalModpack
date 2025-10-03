let $EndersoulHandItem: typeof import("fuzs.mutantmonsters.world.item.EndersoulHandItem").$EndersoulHandItem = Java.loadClass("fuzs.mutantmonsters.world.item.EndersoulHandItem");

let $LivingEntityUseItemEvent$Finish: typeof import("net.neoforged.neoforge.event.entity.living.LivingEntityUseItemEvent$Finish").$LivingEntityUseItemEvent$Finish = Java.loadClass("net.neoforged.neoforge.event.entity.living.LivingEntityUseItemEvent$Finish");


namespace CursedHand {

	ItemEvents.rightClicked(event => {
		const player = event.getEntity();
		if (!(player instanceof $ServerPlayer)) return;

		if (!player.isSecondaryUseActive()) return;

		const stack = event.getItem();
		if (!StackHelper.isCustomItem(stack, "cursed_hand")) return;

		const hitResult = player.pick(32, 1, false);
		if (hitResult.getType() !== $HitResult$Type.BLOCK) {
			// @ts-ignore
			player.displayClientMessage(Component.translatable(stack.getDescriptionId() + ".teleport_failed"), true);
			event.cancel();
		}

		$TaskScheduler.scheduleTask(event.server, 1, () => {
			player.getCooldowns().removeCooldown(stack.getItem());
			player.getCooldowns().addCooldown(stack.getItem(), 10);
		});
	});
}