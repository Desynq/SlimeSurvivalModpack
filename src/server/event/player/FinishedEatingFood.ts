


namespace FinishedEatingFood {
	export function hasNutritionalUncertainty(player: ServerPlayer_): boolean {
		if (SkillHelper.hasSkill(player, FarlanderSkills.NUTRITIONAL_UNCERTAINTY)) return true;

		const daysInfected = RX25Virus.getInfectionDays(player);
		if (daysInfected !== undefined && daysInfected >= 7) return true;

		return false;
	}

	NativeEvents.onEvent($LivingEntityUseItemEvent$Finish, event => {
		const player = event.getEntity();
		if (!(player instanceof $ServerPlayer)) return;

		if (!hasNutritionalUncertainty(player)) return;

		const stack = event.getItem();
		if (stack.getFoodProperties(player) === null) return;

		const food = player.getFoodData();
		const maxHunger = 20;
		if (food.foodLevel < maxHunger) {
			food.setSaturation(0.0);
		}
	});
}