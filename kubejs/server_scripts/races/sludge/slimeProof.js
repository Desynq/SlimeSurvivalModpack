/** @type {typeof import("net.minecraft.world.entity.monster.Slime").$Slime } */
let $Slime = Java.loadClass("net.minecraft.world.entity.monster.Slime")

NativeEvents.onEvent($LivingIncomingDamageEvent, event => {
	const player = event.entity instanceof $Player ? event.entity : null;
	if (player == null) {
		return;
	}

	if (!PlayerRaceSkillHelper.hasSkill(player, SludgeSkills.SlimeProof)) {
		return;
	}

	const slimeEntity = event.source.actual instanceof $Slime ? event.source.actual : null;
	if (slimeEntity == null) {
		return;
	}

	if (slimeEntity.size - 1 > 2) {
		return;
	}

	event.setCanceled(true);
});