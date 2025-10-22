

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
}