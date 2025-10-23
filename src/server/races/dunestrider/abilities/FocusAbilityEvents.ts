
namespace FocusAbilityEvents {
	NativeEvents.onEvent($LivingEntityUseItemEvent$Finish, event => {
		const entity = event.entity;
		if (entity instanceof $ServerPlayer) {
			FocusAbility.onUsedItem(entity);
		}
	});

	NativeEvents.onEvent($LivingEntityUseItemEvent$Stop, event => {
		const entity = event.entity;
		if (entity instanceof $ServerPlayer) {
			FocusAbility.onUsedItem(entity);
		}
	});

	ItemEvents.rightClicked(event => {
		const player = event.player as ServerPlayer_;
		const stack = event.item;
		if (stack.getUseDuration(player) > 0) return;

		FocusAbility.onUsedItem(player);
	});

	NativeEvents.onEvent($LivingDamageEvent$Post, event => {
		const entity = event.entity;
		if (entity instanceof $ServerPlayer) {
			FocusAbility.onDamageTaken(entity);
		}
	});

	NativeEvents.onEvent($LivingIncomingDamageEvent, event => {
		const player = event.entity;
		const flag = player instanceof $ServerPlayer
			&& FocusAbility.isActive(player)
			&& DunestriderSkills.PARRIED.isUnlockedFor(player);
		if (!flag) return;

		const immediate = event.source.immediate;
		const flag2 = immediate instanceof $LivingEntity;
		if (!flag2) return;

		event.setCanceled(true);
		FocusAbility.onDamageTaken(player); // deactivate since we're cancelling the event before it can reach LivingDamageEvent.Post
		LivingEntityHelper.addEffect(immediate, "cataclysm:stun", 40, 0, false, true, true);
		PlaysoundHelper.playsound(player.level, player.position(), "cataclysm:parry", "ambient", 1, 0.5);
	});

	NativeEvents.onEvent($AttackEntityEvent, event => {
		const attacker = event.entity as ServerPlayer_; // always a player
		FocusAbility.onAttack(attacker);
	});

	NativeEvents.onEvent("high", $CriticalHitEvent, event => {
		if (event.isCriticalHit()) return;

		const attacker = event.entity as ServerPlayer_;
		if (FocusAbility.isActive(attacker)) {
			event.setCriticalHit(true);
			event.setDamageMultiplier(1.5);
		}
	});

	NativeEvents.onEvent($ProjectileImpactEvent, event => {
		const projectile = event.getProjectile();
		const flag = projectile instanceof $AbstractArrow;
		if (!flag) return;

		const hit = event.getRayTraceResult();
		if (hit.getType() !== $HitResult$Type.ENTITY) return;

		const ehr = hit as EntityHitResult_;
		const target = ehr.getEntity();

		const flag2 = target instanceof $ServerPlayer
			&& FocusAbility.isActive(target)
			&& DunestriderSkills.DEFLECTION.isUnlockedFor(target);

		if (!flag2) return;

		event.setCanceled(true);
		bounceArrow(projectile, target);
	});

	function bounceArrow(arrow: AbstractArrow_, target: Entity_): void {
		const motion = arrow.getDeltaMovement();
		const normal = motion.normalize().scale(-1);
		const bounce = motion.subtract(normal.scale(2 * motion.dot(normal as any)) as any);

		const newMotion = bounce.scale(0.7);

		arrow.setDeltaMovement(newMotion as any);

		const horizMag = Math.sqrt(newMotion.x() ** 2 + newMotion.z() ** 2);
		arrow.yRot = (Math.atan2(newMotion.x(), newMotion.z()) * 180) / Math.PI;
		arrow.xRot = (Math.atan2(newMotion.y(), horizMag) * 180) / Math.PI;
		arrow.yRotO = arrow.yRot;
		arrow.xRotO = arrow.xRot;

		// triggers S2C motion packet
		arrow.hurtMarked = true;
		arrow.hasImpulse = true;
	}
}