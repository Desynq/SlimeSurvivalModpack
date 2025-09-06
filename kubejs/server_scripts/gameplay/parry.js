/** @type {typeof import("net.minecraft.world.entity.LivingEntity").$LivingEntity } */
let $LivingEntity  = Java.loadClass("net.minecraft.world.entity.LivingEntity")
/** @type {typeof import("net.minecraft.world.entity.projectile.AbstractArrow").$AbstractArrow } */
let $AbstractArrow  = Java.loadClass("net.minecraft.world.entity.projectile.AbstractArrow")
/** @type {typeof import("net.neoforged.neoforge.event.entity.player.AttackEntityEvent").$AttackEntityEvent } */
let $AttackEntityEvent  = Java.loadClass("net.neoforged.neoforge.event.entity.player.AttackEntityEvent")

/** @type {typeof import("fuzs.swordblockingmechanics.handler.SwordBlockingHandler").$SwordBlockingHandler} */
const $SwordBlockingHandler = Java.loadClass("fuzs.swordblockingmechanics.handler.SwordBlockingHandler");

/** @type {typeof import("fuzs.swordblockingmechanics.SwordBlockingHandler").$SwordBlockingMechanics} */
const $SwordBlockingMechanics = Java.loadClass("fuzs.swordblockingmechanics.SwordBlockingMechanics");

/** @type {typeof import("fuzs.swordblockingmechanics.config.ServerConfig").$SBMServerConfig} */
const $SBMServerConfig = Java.loadClass("fuzs.swordblockingmechanics.config.ServerConfig");

/** @type {typeof import("net.minecraft.tags.DamageTypeTags").$DamageTypeTags} */
const $DamageTypeTags = Java.loadClass("net.minecraft.tags.DamageTypeTags");


NativeEvents.onEvent($EventPriority.HIGH, $LivingIncomingDamageEvent, event => {
	try {
		detectParryEvent(event)
	}
	catch (error) {
		console.log(error);
	}
});

/**
 * @param {import("net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent").$LivingIncomingDamageEvent$$Original} event
 */
function detectParryEvent(event) {
	const player = event.entity instanceof $ServerPlayer ? event.entity : null;
	if (player == null) {
		return;
	}
	if (!$SwordBlockingHandler.isActiveItemStackBlocking(player)) {
		return;
	}
	if (event.amount <= 0) {
		return;
	}
	if (!canBlockDamageSource(player, event.source)) {
		playerParryWhiffed(player, event);
		return;
	}
	const isParryActive = $SwordBlockingHandler.getParryStrengthScale(player) > 0;
	const isDeflectable = $SwordBlockingMechanics.CONFIG.get($SBMServerConfig).deflectProjectiles && event.source.is($DamageTypeTags.IS_PROJECTILE);
	if (!isParryActive && !isDeflectable) {
		playerParryWhiffed(player, event);
		return;
	}

	playerParried(player, event);
}

/**
 * @param {import("net.minecraft.server.level.ServerPlayer").$ServerPlayer$$Original} player
 * @param {import("net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent").$LivingIncomingDamageEvent$$Original} damageEvent
 */
function playerParried(player, damageEvent) {
	const attacker = damageEvent.source.actual instanceof $LivingEntity ? damageEvent.source.actual : null;
	if (attacker == null) {
		return;
	}

	const weaknessEffect = new $MobEffectInstance("minecraft:weakness", 60, 0, false, true, true);
	const blindnessEffect = new $MobEffectInstance("minecraft:blindness", 60, 0, false, true, true);
	attacker.addEffect(weaknessEffect);
	attacker.addEffect(blindnessEffect);
}

/**
 * @param {import("net.minecraft.server.level.ServerPlayer").$ServerPlayer$$Original} player
 * @param {import("net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent").$LivingIncomingDamageEvent$$Original} damageEvent
 */
function playerParryWhiffed(player, damageEvent) {
	const miningFatigueEffect = new $MobEffectInstance("minecraft:mining_fatigue", 100, 1, false, true, true);
	const slownessEffect = new $MobEffectInstance("minecraft:slowness", 100, 1, false, true, true);
	player.addEffect(miningFatigueEffect);
	player.addEffect(slownessEffect);
}


/**
 * 
 * @param {import("net.minecraft.server.level.ServerPlayer").$ServerPlayer$$Original} player 
 * @param {import("net.minecraft.world.damagesource.DamageSource").$DamageSource$$Original} source 
 * @returns 
 */
function canBlockDamageSource(player, source) {
	const entity = source.actual;
	const arrow = entity instanceof $AbstractArrow ? entity : null;
	if (arrow) {
		if (arrow.getPierceLevel() > 0) {
			return false;
		}
	}

	if (source.is($DamageTypeTags.BYPASSES_ARMOR)) {
		return false;
	}

	let position = source.getSourcePosition();
	if (position == null) {
		return false;
	}
	position = position.vectorTo(player.position()).normalize();
	position = new $Vec3(position.x(), 0.0, position.z());

	const protectionArc = $SwordBlockingMechanics.CONFIG.get($SBMServerConfig).protectionArc;
	const arcDotThreshold = -Math.cos(protectionArc * Math.PI * 0.5 / 180.0);
	const viewVector = player.getViewVector(1.0);
	return position.dot(viewVector) <= arcDotThreshold;
}