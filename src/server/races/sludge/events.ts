
namespace SludgeEvents {

	NativeEvents.onEvent($LivingEntityUseItemEvent$Start, event => {
		Phagocytosis.onUseItemStart(event);
	});

	NativeEvents.onEvent($LivingIncomingDamageEvent, event => {
		if (event.isCanceled()) return;

		const player = event.entity;
		if (!(player instanceof $ServerPlayer)) return;

		const amount = event.amount;
		if (amount <= 0) return;

		if (!event.source.is($DamageTypeTags.IS_FIRE as any)) return;

		if (SludgeSkills.VOLATILE.isLockedFor(player)) return;

		const maxHealth = player.maxHealth;
		if (maxHealth <= 0) return;

		const attackDamage = player.getAttributeValue($Attributes.ATTACK_DAMAGE);

		const newAmount = amount * (1 + attackDamage / maxHealth);
		event.setAmount(newAmount);
	});
}