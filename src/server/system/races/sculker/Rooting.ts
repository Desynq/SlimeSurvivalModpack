

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

		const rootType = getRootType(player);
		switch (rootType) {
			case "none":
				return;
			case "normal":
				armorModifier.add(player);
				toughnessModifier.add(player);
				if (SculkerSkills.ROOTED.isUnlockedFor(player)) {
					kbResistModifier.add(player);
					rootedEffect.apply(player);
				}
				break;
			case "quickroot":
				armorModifier.add(player);
				break;
			default: exhaustiveSwitch(rootType);
		}

		$BuiltInRegistries.BLOCK.getTag;
		player.blockStateOn.is("");
	}

	type RootType = "none" | "normal" | "quickroot";

	function getRootType(player: ServerPlayer_): RootType {
		if (!(player.crouching && player.shiftKeyDown && !KeybindHelper.isMoving(player))) return "none";

		if (player.mainHandItem.isEmpty() && (player.offHandItem.isEmpty() || StackHelper.isTag(player.offhandItem, "c:tools/shields"))) return "normal";

		if (SculkerSkills.QUICKROOT.isUnlockedFor(player)) return "quickroot";

		return "none";
	}
}