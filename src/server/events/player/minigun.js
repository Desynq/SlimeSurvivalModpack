
const Minigun = {};

/**
 * 
 * @param {import("net.minecraft.world.item.ItemStack").$ItemStack$$Original} stack 
 * @returns 
 */
Minigun.isMinigun = function(stack) {
	const components = stack.getComponents();
	if (components == null) {
		return false;
	}
	const customData = components.get($DataComponents.CUSTOM_DATA);
	if (customData == null) {
		return false;
	}
	const id = customData.copyTag().getString("id");
	return id === "minigun";
}

/**
 * 
 * @param {ServerPlayer_} player 
 * @param {import("net.minecraft.world.item.ItemStack").$ItemStack$$Original} gun
 */
Minigun.tryFire = function(player, gun) {
	const ammoItem = $BuiltInRegistries.ITEM.get("minecraft:iron_nugget");
	let ammoCount = player.inventory.countItem(ammoItem);
	if (ammoCount <= 0) {
		return;
	}

	if (!TickHelper.tryUpdateTimestamp(player, "minigun_fire_cooldown", 1)) {
		return;
	}

	Minigun.fire(player, gun);
	Minigun.fire(player, gun);
}

/**
 * 
 * @param {ServerPlayer_} shooter 
 * @param {import("net.minecraft.world.item.ItemStack").$ItemStack$$Original} weapon
 */
Minigun.fire = function(shooter, weapon) {
	if (!shooter.isCreative()) {
		// shooter.server.runCommandSilent(`clear ${shooter.username} minecraft:iron_nugget 1`);
	}

	playsound(shooter.level, shooter.position(), "minecraft:entity.firework_rocket.large_blast", "ambient", 8, 2);

	const arrowStack = new $ItemStack($Items.ARROW);
	/** @type {import("net.minecraft.world.item.ArrowItem").$ArrowItem$$Original} */
	// @ts-ignore
	const arrowItem = $Items.ARROW;

	// @ts-ignore
	const arrow = arrowItem.createArrow(shooter.level, arrowStack, shooter, weapon);

	const tag = new $CompoundTag();
	arrow.saveWithoutId(tag);

	tag.putByte("pickup", 2);
	tag.putDouble("damage", 1);

	arrow.load(tag);

	arrow.shootFromRotation(shooter, shooter.xRot, shooter.yRot, 0, 10, 20);

	// @ts-ignore
	shooter.level.addFreshEntity(arrow);
}

/**
 * @param {ServerPlayer_} player 
 */
Minigun.isFiring = function(player) {
	return player.persistentData.getBoolean("minigun_firing");
}

/**
 * 
 * @param {ServerPlayer_} player 
 */
Minigun.toggleFiring = function(player) {
	player.persistentData.putBoolean("minigun_firing", !Minigun.isFiring(player));
}


PlayerEvents.tick(event => {
	const player = event.getPlayer();
	if (!(player instanceof $ServerPlayer)) {
		return;
	}

	AttributeHelper.removeModifier(player, $Attributes.MOVEMENT_SPEED, "slimesurvival:minigun_slowdown");

	if (!Minigun.isFiring(player)) {
		return;
	}

	const stack = event.getPlayer().getMainHandItem();
	if (!Minigun.isMinigun(stack)) {
		Minigun.toggleFiring(player);
		return;
	}

	AttributeHelper.addModifier(player, $Attributes.MOVEMENT_SPEED, "slimesurvival:minigun_slowdown", -0.75, "add_multiplied_total");
	LivingEntityHelper.addEffect(player, "slimesurvival:weak_knees", 1, 255, false, false, false);

	Minigun.tryFire(player, stack);
});

NativeEvents.onEvent($PlayerInteractEvent$RightClickItem, event => {
	const stack = event.getItemStack();
	if (!Minigun.isMinigun(stack)) {
		return;
	}

	const player = event.getEntity();
	if (!(player instanceof $ServerPlayer)) {
		return;
	}

	Minigun.toggleFiring(player);
});

NativeEvents.onEvent($ProjectileImpactEvent, event => {
	let result = event.getRayTraceResult();
	if (result.getType() !== $HitResult$Type.BLOCK) {
		return;
	}
	let stack = event.getProjectile().getWeaponItem();
	if (stack == null || !Minigun.isMinigun(stack)) {
		return;
	}

	event.getEntity().kill();
})