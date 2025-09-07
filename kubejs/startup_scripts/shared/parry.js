
const Parry = {};

/**
 * @param {import("net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent").$LivingIncomingDamageEvent$$Original} event
 */
Parry.onLivingIncomingDamage = function(event) {
	const player = event.entity instanceof $Player ? event.entity : null;
	if (player == null) {
		return;
	}
	if (!$SwordBlockingHandler.isActiveItemStackBlocking(player)) {
		return;
	}
	if (event.amount <= 0) {
		return;
	}
	if (!Parry.canBlockDamageSource(player, event.source)) {
		Parry.playerParryWhiffed(player, event);
		return;
	}
	const isParryActive = $SwordBlockingHandler.getParryStrengthScale(player) > 0;
	const isDeflectable = $SwordBlockingMechanics.CONFIG.get($SBMServerConfig).deflectProjectiles && event.source.is($DamageTypeTags.IS_PROJECTILE);
	if (!isParryActive && !isDeflectable) {
		Parry.playerParryWhiffed(player, event);
		return;
	}

	Parry.playerParried(player, event);
}

/**
 * @param {import("net.minecraft.world.entity.player.Player").$Player$$Original} player
 * @param {import("net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent").$LivingIncomingDamageEvent$$Original} damageEvent
 */
Parry.playerParried = function(player, damageEvent) {
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
 * @param {import("net.minecraft.world.entity.player.Player").$Player$$Original} player
 * @param {import("net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent").$LivingIncomingDamageEvent$$Original} damageEvent
 */
Parry.playerParryWhiffed = function(player, damageEvent) {
	const miningFatigueEffect = new $MobEffectInstance("minecraft:mining_fatigue", 100, 1, false, true, true);
	const slownessEffect = new $MobEffectInstance("minecraft:slowness", 100, 1, false, true, true);
	player.addEffect(miningFatigueEffect);
	player.addEffect(slownessEffect);
	player.resetAttackStrengthTicker();
}


/**
 * 
 * @param {import("net.minecraft.world.entity.player.Player").$Player$$Original} player 
 * @param {import("net.minecraft.world.damagesource.DamageSource").$DamageSource$$Original} source 
 * @returns 
 */
Parry.canBlockDamageSource = function(player, source) {
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


global.Parry = Parry;
NativeEvents.onEvent($EventPriority.HIGH, $LivingIncomingDamageEvent, event => global.Parry.onLivingIncomingDamage(event));