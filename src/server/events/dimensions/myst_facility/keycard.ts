

namespace MystKeycardHandler {

	BlockEvents.rightClicked("minecraft:iron_door" as any, event => {
		const blockWrapper = event.block;
		const blockState = blockWrapper.getBlockState();
		const doorBlock = blockWrapper.getBlock();
		const blockPos = blockWrapper.getPos();
		if (!(doorBlock instanceof $DoorBlock)) return;

		const player = event.player as ServerPlayer_;
		const mainhandKeycardLevel = StackHelper.getCustomInt(player.mainHandItem, "kc");
		const offhandKeycardLevel = StackHelper.getCustomInt(player.offHandItem, "kc");

		// avoids running twice if the player has a keycard in both hands
		const previouslyHadKeycard = event.hand === $InteractionHand.OFF_HAND && mainhandKeycardLevel !== undefined;
		if (previouslyHadKeycard) return;

		// avoids warning the player needlessly
		const willHaveKeycard = event.hand === $InteractionHand.MAIN_HAND && mainhandKeycardLevel === undefined && offhandKeycardLevel !== undefined;
		if (willHaveKeycard) return;

		const noKeycardAndAlreadyWarned = event.hand === $InteractionHand.OFF_HAND && mainhandKeycardLevel === undefined && offhandKeycardLevel === undefined;
		if (noKeycardAndAlreadyWarned) return;

		const playerKeycardLevel = event.hand === $InteractionHand.MAIN_HAND ? mainhandKeycardLevel : offhandKeycardLevel;

		const dispenserX = blockWrapper.getX();
		const dispenserZ = blockWrapper.getZ();
		let dispenserY = blockWrapper.getY() - 2;
		const half = blockWrapper.getProperties().get("half") as "upper" | "lower";
		if (half === "upper") {
			dispenserY--;
		}

		const level = event.level;
		const dispenser = level.getBlock(dispenserX, dispenserY, dispenserZ);
		const inventory = dispenser.getInventory();
		if (inventory == null) return;

		const stack = inventory.getStackInSlot(0);
		const doorKeycardLevel = StackHelper.getCustomInt(stack, "kc");
		if (doorKeycardLevel === undefined) return;

		if (playerKeycardLevel === undefined) {
			player.tell(`This door requires at least a level ${doorKeycardLevel} keycard.`);
			return;
		}

		if (playerKeycardLevel < doorKeycardLevel) {
			player.tell(`This door requires at least a level ${doorKeycardLevel} keycard. You have a level ${playerKeycardLevel} keycard.`);
			return;
		}

		const isOpen = doorBlock.isOpen(blockState as any);
		doorBlock.setOpen(player, level, blockState as any, blockPos as any, !isOpen);
		PlaysoundHelper.playsound(level, new Vec3d(blockPos.x, blockPos.y, blockPos.z), isOpen ? "block.iron_door.close" : "block.iron_door.open", "block", 1, 1);
	});
}