/** @type {typeof import("net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$RightClickItem").$PlayerInteractEvent$RightClickItem } */
let $PlayerInteractEvent$RightClickItem  = Java.loadClass("net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$RightClickItem")


NativeEvents.onEvent($PlayerInteractEvent$RightClickItem, event => {
	const player = event.entity instanceof $ServerPlayer ? event.entity : null;
	if (player == null) {
		return;
	}

	if (event.itemStack.item.id != "minecraft:goat_horn") {
		return;
	}

	const instrumentComp = event.itemStack.get($DataComponents.INSTRUMENT);
	if (instrumentComp == null) {
		return;
	}
	
	const instrumentId = instrumentComp.getKey().location();
	switch (instrumentId) {
		case "minecraft:seek_goat_horn":
			if (!player.crouching) {
				applyGoatHornEffect(player);
				break;
			}
			const radius = 16;
			const box = AABB.of(
				player.x - radius, player.y - radius, player.z - radius,
				player.x + radius, player.y + radius, player.z + radius
			);
			player.level.getEntitiesOfClass($LivingEntity, box).forEach(e => applyGoatHornEffect(e));
			break;
	}

	/**
	 * 
	 * @param {import("net.minecraft.world.entity.LivingEntity").$LivingEntity$$Original} entity 
	 */
	function applyGoatHornEffect(entity) {
		const buff = new $MobEffectInstance("minecraft:speed", 200, 0, false, true, true);
		const debuff = new $MobEffectInstance("minecraft:glowing", 200, 0, false, true, true);
		entity.addEffect(buff);
		entity.addEffect(debuff);
	}
});