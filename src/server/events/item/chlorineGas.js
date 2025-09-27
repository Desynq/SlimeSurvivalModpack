/** @type {typeof import("net.minecraft.world.item.component.CustomData").$CustomData } */
let $CustomData = Java.loadClass("net.minecraft.world.item.component.CustomData")

/**
 * @param {import("net.minecraft.world.entity.item.ItemEntity").$ItemEntity$$Original} itemEntity 
 */
function isChlorineGasGrenade(itemEntity) {
	const customData = itemEntity.item.components.get($DataComponents.CUSTOM_DATA);
	if (customData == null) {
		return false;
	}
	const id = customData.copyTag().getString("id");
	return id === "chlorine_gas_grenade";
}

/**
 * @param {import("net.minecraft.world.entity.item.ItemEntity").$ItemEntity$$Original} entity 
 */
function ChlorineGasGrenadeTick(entity) {
	this.entity = entity;
	this.level = entity.level;
	this.dim = entity.level.dimension.toString();
	this.position = entity.position();
	this.x = this.position.x();
	this.y = this.position.y();
	this.z = this.position.z();

	if (this.entity.inWater) {
		playsound(this.level, entity.position(), "minecraft:block.fire.extinguish", "master", 2, 2);
		this.entity.kill();
		return;
	}

	if (!this.entity.glowing) {
		this.entity.setInvulnerable(true);
		this.entity.setGlowing(true);
		this.entity.setPickUpDelay(2147483647);
	}

	if (this.entity.onGround()) {
		this.whileOnGround();
	}
}

ChlorineGasGrenadeTick.prototype.whileOnGround = function() {
	this.killNearbyChlorineGasGrenades();
	this.incrementDespawnTime();

	CommandHelper.runCommandSilent(this.entity.server,
		`execute in ${this.dim} positioned ${this.x} ${this.y} ${this.z} run particle minecraft:dust{color:[0.55,0.725,0.1],scale:4} ~ ~1.5 ~ 3 1 3 0 10 force @a`
	);

	const despawnTime = this.getDespawnTime();
	if (despawnTime === 1) {
		playsound(this.level, this.position, "minecraft:block.iron_door.open", "master", 2, 0.5);
	}
	else if (despawnTime === 5) {
		playsound(this.level, this.position, "minecraft:entity.generic.burn", "master", 2, 0.5);
	}
	else if (despawnTime >= 250 && despawnTime <= 290 && despawnTime % 10 === 0) {
		playsound(this.level, this.position, "minecraft:block.fire.extinguish", "master", 2, 2);
	}
	else if (despawnTime >= 300) {
		playsound(this.level, this.position, "minecraft:block.fire.extinguish", "master", 2, 0.5);
		this.entity.kill();
	}

	this.damageNearby();
}

ChlorineGasGrenadeTick.prototype.killNearbyChlorineGasGrenades = function() {
	const level = this.entity.level;
	const range = this.entity.getBoundingBox().inflate(3, 1, 3);

	/** @type {import("java.util.List").$List$$Original<ItemEntity>} */
	// @ts-ignore
	const grenades = level.getEntitiesOfClass($ItemEntity, range, e => e.onGround() && isChlorineGasGrenade(e));
	/** @type {ItemEntity | null} */
	// @ts-ignore
	const oldest = grenades.stream().max($Comparator.comparingInt(e => e.age)).orElse(null);

	grenades.stream().filter(e => e != oldest).forEach(e => e.kill());
}

ChlorineGasGrenadeTick.prototype.getDespawnTime = function() {
	return this.entity.persistentData.getInt("despawn_timer");
}

ChlorineGasGrenadeTick.prototype.incrementDespawnTime = function() {
	this.entity.persistentData.putInt("despawn_timer", this.getDespawnTime() + 1);
}

/**
 * 
 * @param {LivingEntity_} entity 
 */
ChlorineGasGrenadeTick.isWearingGasMask = function(entity) {
	const customData = entity.headArmorItem.components.get($DataComponents.CUSTOM_DATA);
	if (customData == null) {
		return false;
	}
	const id = customData.copyTag().getString("id");
	return id === "slimesurvival:gas_mask";
}

/**
 * 
 * @param {LivingEntity_} entity 
 */
ChlorineGasGrenadeTick.canBeAffectedByChlorine = function(entity) {
	if (entity instanceof $ServerPlayer) {
		if (!PlayerHelper.isSurvivalLike(entity)) {
			return false
		}
		if (ChlorineGasGrenadeTick.isWearingGasMask(entity)) {
			return false;
		}
	}
	return !entity.isInvulnerable() && TickHelper.getGameTime(entity.server) - entity.persistentData.getLong("last_chlorine_damage_tick") > 20
}

ChlorineGasGrenadeTick.prototype.damageNearby = function() {
	const range = this.entity.getBoundingBox().inflate(4, 2, 4);

	/** @type {import("java.util.List").$List$$Original<LivingEntity_>} */
	// @ts-ignore
	const entities = this.level.getEntitiesOfClass($LivingEntity, range, /** @param {LivingEntity_} e */ e => ChlorineGasGrenadeTick.canBeAffectedByChlorine(e));
	entities.forEach(e => {
		// @ts-ignore
		LivingEntityHelper.addEffect(e, "minecraft:nausea", 200, 0, false, true, true, this.entity);
		// @ts-ignore
		LivingEntityHelper.addEffect(e, "minecraft:blindness", 100, 0, false, true, true, this.entity);
		// @ts-ignore
		LivingEntityHelper.addEffect(e, "minecraft:slowness", 200, 1, false, true, true, this.entity);
		// @ts-ignore
		LivingEntityHelper.addEffect(e, "minecraft:wither", 100, 2, false, true, true, this.entity);

		playsound(this.level, this.position, "minecraft:entity.blaze.ambient", "master", 1, 1.75);
		e.persistentData.putLong("last_chlorine_damage_tick", TickHelper.getGameTime(e.server));
	});
}