/** @type {typeof import("net.minecraft.world.item.Items").$Items } */
let $Items = Java.loadClass("net.minecraft.world.item.Items")
/** @type {typeof import("net.minecraft.world.entity.projectile.Arrow").$Arrow } */
let $Arrow = Java.loadClass("net.minecraft.world.entity.projectile.Arrow")
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

	if (!TickHelper.timestamp(player, "bolt_action_rifle_fire_cooldown", 20)) {
		return;
	}

	BoltActionRifle.fire(player, gun);
}

/**
 * 
 * @param {ServerPlayer} player 
 * @param {import("net.minecraft.world.item.ItemStack").$ItemStack$$Original} gun
 */
BoltActionRifle.fire = function(player, gun) {
	player.server.runCommandSilent(`clear ${player.username} minecraft:iron_nugget 1`);

	playsound(player.level, player.position(), "minecraft:entity.firework_rocket.large_blast", "master", 16, 1);

	const eyePos = player.getEyePosition();

	const arrowStack = new $ItemStack($Items.ARROW);
	// @ts-ignore
	const arrow = new $Arrow(player.level, player, arrowStack, gun);
	arrow.setNoGravity(true);

	// @ts-ignore
	arrow.setPos(eyePos);
	arrow.shootFromRotation(player, player.xRot, player.yRot, 0, 10, 0);

	const tag = new $CompoundTag();
	arrow.saveWithoutId(tag);

	// tag.putByte("PierceLevel", 10);

	arrow.load(tag);

	// @ts-ignore
	player.level.addFreshEntity(arrow);
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