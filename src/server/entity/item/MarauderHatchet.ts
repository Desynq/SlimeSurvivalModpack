


namespace MarauderHatchetManager {
	function isMarauderHatchet(stack: ItemStack_): boolean {
		return StackHelper.isCustomItem(stack, "marauder_hatchet");
	}

	NativeEvents.onEvent($LivingEntityUseItemEvent$Stop, event => {
		const player = event.entity;
		if (!(player instanceof $ServerPlayer)) return;

		const stack = event.item;
		if (!isMarauderHatchet(stack)) return;

		event.setCanceled(true);
		// shadowing illager invasion code with some tweaks

		const useDuration = stack.getUseDuration(player) - event.duration;
		if (useDuration < 10) return;

		if (!player.hasInfiniteMaterials() && stack.isDamageableItem()) {
			stack.setDamageValue(stack.getDamageValue() + 1);
		}

		const slotIndex = event.hand === $InteractionHand.MAIN_HAND ? player.inventory.selected + 36 : 40;
		player.connection.send(new $ClientboundContainerSetSlotPacket(
			0, player.containerMenu.stateId, slotIndex, stack as any
		));

		const level = player.level;

		const hatchet = new $Hatchet(level, player, stack.copy());
		hatchet.shootFromRotation(player, player.xRot, player.yRot, 0.0, 1.0 + 0.5, 1.0);
		hatchet.pickup = $AbstractArrow$Pickup.CREATIVE_ONLY;
		level.addFreshEntity(hatchet);

		playsound(level, hatchet.position(), "item.trident.throw", "players", 1.0, 1.0);
		player["awardStat(net.minecraft.stats.Stat)"]($Stats.ITEM_USED.get(stack.item));
	});

	EntityEvents.afterHurt(event => {
		const weapon = event.getSource().getWeaponItem() as ItemStack_ | null;
		if (!weapon) return;

		if (!isMarauderHatchet(weapon)) return;

		const victim = event.getEntity();
		const attacker = event.getSource().getActual() as Entity_ | null;
		const immediate = event.getSource().getImmediate() as Entity_ | null;

		if (immediate instanceof $Hatchet) {
			if (victim instanceof $ServerPlayer) {
				victim.disableShield();
			}

			LivingEntityHelper.addEffect(victim, "cataclysm:bone_fracture", 100, 3, false, true, true, attacker);
		}
		else if (attacker && immediate === attacker) {
		}
	});
}