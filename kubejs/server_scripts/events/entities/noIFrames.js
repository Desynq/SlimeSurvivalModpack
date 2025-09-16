/** @type {typeof import("net.neoforged.neoforge.event.entity.living.LivingKnockBackEvent").$LivingKnockBackEvent } */
let $LivingKnockBackEvent = Java.loadClass("net.neoforged.neoforge.event.entity.living.LivingKnockBackEvent")
/** @type {typeof import("net.neoforged.neoforge.event.entity.player.AttackEntityEvent").$AttackEntityEvent } */
let $AttackEntityEvent = Java.loadClass("net.neoforged.neoforge.event.entity.player.AttackEntityEvent")
/** @type {typeof import("net.minecraft.world.entity.EntityType").$EntityType } */
let $EntityType = Java.loadClass("net.minecraft.world.entity.EntityType")

const NoIFrames = {};

NoIFrames.whitelistedSources = {
	"inFire": true,
	"onFire": true,
	"lava": true,
	"sweetBerryBush": true,
	"cactus": true,
	"lightningBolt": true,
	"inWall": true,
	"hotFloor": true,
	"outOfWorld": true,
	"freeze": true,
	"wither": true,
};

NoIFrames.whitelistedEntities = {
	"minecraft:slime": true,
	"minecraft:magma_cube": true,
	"tconstruct:earth_slime": true,
	"tconstruct:sky_slime": true,
	"tconstruct:ender_slime": true,
	"tconstruct:terracube": true,
	"twilightforest:maze_slime": true,
};

NoIFrames.ATTACK_STRENGTH_THRESHOLD = 0.5;
NoIFrames.KNOCKBACK_STRENGTH_THRESHOLD = 0.75;

/**
 * @param {LivingEntity} victim
 * @param {import("net.minecraft.world.damagesource.DamageSource").$DamageSource$$Original} source 
 */
NoIFrames.isPoison = function(victim, source) {
	const attacker = source.getActual();
	return source.type().msgId() === "magic" && victim.hasEffect($MobEffects.POISON);
}


NativeEvents.onEvent("low", $LivingIncomingDamageEvent, event => {
	if (event.isCanceled()) {
		return;
	}

	const victim = event.getEntity();

	const source = event.getSource();
	const attacker = source.getActual();
	const attackerType = attacker != null ? attacker.getType() : null;

	if (NoIFrames.isPoison(victim, source)) {
		return;
	}
	if (NoIFrames.whitelistedSources.indexOf(source.type().msgId()) !== -1) {
		return;
	}
	if (attackerType != null && NoIFrames.whitelistedEntities.indexOf(attackerType) !== -1) {
		return;
	}

	victim.invulnerableTime = 0;
});

NativeEvents.onEvent("lowest", $AttackEntityEvent, event => {
	if (event.isCanceled()) {
		return;
	}

	const player = event.getEntity();
	if (!(player instanceof $Player)) {
		return;
	}

	const strength = player.getAttackStrengthScale(0);
	if (strength <= NoIFrames.ATTACK_STRENGTH_THRESHOLD) {
		event.setCanceled(true);
		return;
	}

	if (strength <= NoIFrames.KNOCKBACK_STRENGTH_THRESHOLD) {
		const target = event.getTarget();
		if (target instanceof $LivingEntity) {
			target.swinging = true;
		}
	}
});

NativeEvents.onEvent("lowest", $LivingKnockBackEvent, event => {
	if (event.isCanceled()) {
		return;
	}

	const entity = event.getEntity();
	if (entity.swinging) {
		event.setCanceled(true);
		entity.swinging = false;
	}
});



EntityEvents.beforeHurt("minecraft:player", event => {
	debugTell(event.entity, event.source.type().msgId());
});