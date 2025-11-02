// @ts-ignore
let $Slime: typeof import("net.minecraft.world.entity.monster.Slime").$Slime = Java.loadClass("net.minecraft.world.entity.monster.Slime");

NativeEvents.onEvent($LivingIncomingDamageEvent, event => {
	const player = event.entity;
	if (!(player instanceof $ServerPlayer)) return;

	const tier = SkillHelper.getSkillTier(player,
		SludgeSkills.SLIMEPROOF,
		SludgeSkills.SLIMEPROOF_2
	);

	if (tier === 0) return;

	const slimeEntity = event.source.actual;
	if (!(slimeEntity instanceof $Slime)) return;

	const size = slimeEntity.size;
	const mediumSize = 2;
	const largeSize = 4;

	switch (tier) {
		case 1:
			if (size > mediumSize) return;
			break;
		case 2:
			if (size > largeSize) return;
			break;
		default:
			return;
	}

	event.setCanceled(true);
});