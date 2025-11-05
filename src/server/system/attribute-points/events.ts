

namespace AttributePointEvents {

	ServerEvents.tick(event => {
		const server = event.server;

		const players = ServerHelper.getPlayers(server);
		for (const player of players) {
			applyStrengthPointsModifier(player);
		}
	});

	const strengthModifier = new AttributeModifierController("minecraft:generic.attack_damage", "strength_points", 0.0, "add_multiplied_base");

	function applyStrengthPointsModifier(player: ServerPlayer_): void {
		strengthModifier.remove(player);
		if (ChimeraSkills.TOXOPHILITE.isUnlockedFor(player)) return;

		const points = AttributePointHelper.getStrengthPoints(player);
		const value = 0.05 * points;
		strengthModifier.apply(player, value);
	}


}