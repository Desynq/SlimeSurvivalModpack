
const BoltActionRifle = {};

/**
 * 
 * @param {import("net.minecraft.world.item.ItemStack").$ItemStack$$Original} item 
 * @returns 
 */
BoltActionRifle.isBoltActionRifle = function(item) {
	const customData = item.components.get($DataComponents.CUSTOM_DATA);
	if (customData == null) {
		return false;
	}
	const id = customData.copyTag().getString("id");
	return id === "bolt_action_rifle";
}

/**
 * 
 * @param {ServerPlayer} player 
 * @param {import("net.minecraft.world.item.ItemStack").$ItemStack$$Original} gun
 */
BoltActionRifle.tryFire = function(player, gun) {
	const ammoItem = $BuiltInRegistries.ITEM.get("minecraft:iron_nugget");
	let ammoCount = player.inventory.countItem(ammoItem);
	if (ammoCount <= 0) {
		return;
	}

	if (!TickHelper.updateTimestamp(player, "bolt_action_rifle_fire_cooldown", 20)) {
		return;
	}

	BoltActionRifle.fire(player, gun);
}

/**
 * 
 * @param {ServerPlayer} shooter 
 * @param {import("net.minecraft.world.item.ItemStack").$ItemStack$$Original} weapon
 */
BoltActionRifle.fire = function(shooter, weapon) {
	shooter.server.runCommandSilent(`clear ${shooter.username} minecraft:iron_nugget 1`);

	playsound(shooter.level, shooter.position(), "minecraft:entity.firework_rocket.large_blast", "master", 16, 1);

	const arrowStack = new $ItemStack($Items.ARROW);
	/** @type {import("net.minecraft.world.item.ArrowItem").$ArrowItem$$Original} */
	// @ts-ignore
	const arrowItem = $Items.ARROW;

	// @ts-ignore
	const arrow = arrowItem.createArrow(shooter.level, arrowStack, shooter, weapon);

	const tag = new $CompoundTag();
	arrow.saveWithoutId(tag);

	tag.putByte("pickup", 2);
	tag.putByte("PierceLevel", 10);
	tag.putDouble("damage", 3);

	arrow.load(tag);

	const speed = Velocity.get(shooter);
	// const shootingFirework = shooter.level.entities.stream().anyMatch(e => e instanceof $FireworkRocketEntity && e.ownedBy(shooter))
	// let spread = shooter.fallFlying && !shootingFirework ? 0 : speed * 50;
	let spread = speed * 50;
	shooter.tell(spread.toString());
	arrow.shootFromRotation(shooter, shooter.xRot, shooter.yRot, 0, 20, spread);

	// @ts-ignore
	shooter.level.addFreshEntity(arrow);
}



NativeEvents.onEvent($PlayerInteractEvent$RightClickItem, event => {
	const stack = event.getItemStack();
	if (!BoltActionRifle.isBoltActionRifle(stack)) {
		return;
	}

	const player = event.getEntity();
	if (!(player instanceof $ServerPlayer)) {
		return;
	}

	BoltActionRifle.tryFire(player, stack);
});