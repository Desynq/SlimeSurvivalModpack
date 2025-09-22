
const Phagocytosis = new (class SludgePhagocytosis {

	private getSpeedModifier(tier: integer): integer {
		let base = 1.0;
		switch (tier) {
			case 1:
				return base + 0.25;
			case 2:
				return base + 0.50;
			case 3:
				return base + 0.75;
			case 4:
				return base + 1.00;
			default:
				return base;
		}
	}

	public onUseItemStart(event: import("net.neoforged.neoforge.event.entity.living.LivingEntityUseItemEvent$Start").$LivingEntityUseItemEvent$Start$$Original) {
		const result = SkillHelper.asPlayerWithSkillTier(event.getEntity(),
			SludgeSkills.PHAGOCYTOSIS,
			SludgeSkills.PHAGOCYTOSIS_2,
			SludgeSkills.PHAGOCYTOSIS_3,
			SludgeSkills.PHAGOCYTOSIS_4
		);
		if (!result) return;
		const { player, tier } = result;

		const speedModifier: integer = this.getSpeedModifier(tier);
		if (speedModifier === 1.0) return;

		const stack = event.getItem();
		// @ts-ignore
		if (!stack.has($DataComponents.FOOD)) {
			return;
		}

		event.setDuration(event.getDuration() / speedModifier);
	}
})();