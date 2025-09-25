

namespace SludgeCytoplasm {

	const MODIFIER_KEY = "sludge.cytoplasm_slowdown";

	function getSlowdownPercentage(player: ServerPlayer, cytoplasmTier: integer): float {
		if (SkillHelper.hasSkill(player, SludgeSkills.CYTOSKELETON)) {
			return 0.0;
		}
		switch (cytoplasmTier) {
			case 1:
				return 0.0;
			case 2:
				return -0.25;
			case 3:
				return -0.5;
			case 4:
				return -1.0;
			default:
				return 0.0;
		}
	}

	PlayerEvents.tick(event => {
		const player = event.getPlayer() as ServerPlayer;

		const tier = SkillHelper.getSkillTier(player,
			SludgeSkills.CYTOPLASM_1,
			SludgeSkills.CYTOPLASM_2,
			SludgeSkills.CYTOPLASM_3,
			SludgeSkills.CYTOPLASM_4,
		);
		AttributeHelper.removeModifier(player, "minecraft:generic.movement_speed", MODIFIER_KEY);
		if (tier <= 0) return;
		if (player.health >= player.maxHealth && !CytoplasmDisabler.isToggleActive(player)) {
			LivingEntityHelper.addEffect(player, "minecraft:resistance", 1, tier - 1, false, false, true);
			const slowdownPercentage = getSlowdownPercentage(player, tier);
			if (slowdownPercentage >= 0) return;
			AttributeHelper.addModifier(player, "minecraft:generic.movement_speed", MODIFIER_KEY, slowdownPercentage, "add_multiplied_total");
		}
	});

	export const CytoplasmDisabler = new AbilityToggle(new ToggleController("sludge.cytoplasm.disabled"));
}