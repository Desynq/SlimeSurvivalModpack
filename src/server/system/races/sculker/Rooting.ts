

namespace Sculker.Rooting {

	const armorModifier = new AttributeModifierController("minecraft:generic.armor", "sculker.rooting.armor", 1.0, "add_multiplied_total");
	const toughnessModifier = new AttributeModifierController("minecraft:generic.armor_toughness", "sculker.rooting.toughness", 1.0, "add_multiplied_total");
	const kbResistModifier = new AttributeModifierController("minecraft:generic.knockback_resistance", "sculker.rooting.kb_resist", 0.5, "add_value");

	const rootedEffect = MobEffectApplicator.of("slimesurvival:rooted").withVisibility(true, false).withDuration(2);


	/**
	 * Should be called for all players, not just sculkers in order to remove modifiers if they were previously a sculker.
	 */
	export function tick(player: ServerPlayer_): void {
		armorModifier.remove(player);
		toughnessModifier.remove(player);
		kbResistModifier.remove(player);

		if (SculkerSkills.ROOTING.isLockedFor(player)) return;

		if (!canRoot(player)) return;

		armorModifier.add(player);
		toughnessModifier.add(player);

		if (SculkerSkills.ROOTED.isUnlockedFor(player)) {
			kbResistModifier.add(player);
			rootedEffect.apply(player);
		}
	}

	/**
	 * Assumes player already has the Rooting skill
	 */
	function canRoot(player: ServerPlayer_): boolean {
		return player.crouching
			&& player.onGround()
			&& player.mainHandItem.isEmpty()
			&& (player.offHandItem.isEmpty() || player.offHandItem.id.toString() === "minecraft:shield")
			&& !KeybindHelper.isMoving(player);
	}
}