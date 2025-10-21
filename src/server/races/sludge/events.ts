
namespace SludgeEvents {

	NativeEvents.onEvent($LivingEntityUseItemEvent$Start, event => {
		Phagocytosis.onUseItemStart(event);
	});

	NativeEvents.onEvent($LivingIncomingDamageEvent, event => {
		if (event.isCanceled()) return;

		const amount = event.amount;
		if (amount <= 0) return;

		const player = event.entity;
		if (!(player instanceof $ServerPlayer)) return;

		if (SludgeSkills.VOLATILE.isLockedFor(player)) return;

		const maxHealth = player.maxHealth;
		if (maxHealth <= 0) return;

		const attackDamage = player.getAttributeValue($Attributes.ATTACK_DAMAGE);
		if (attackDamage <= maxHealth) return;

		const newAmount = amount * (attackDamage / maxHealth);
		event.setAmount(newAmount);
	});
}