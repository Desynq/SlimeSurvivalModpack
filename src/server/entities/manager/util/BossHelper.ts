// priority: 2

interface PlayerDistance {
	player: ServerPlayer_;
	distance: double;
}


class BossHelper {

	public static getSurvivorDistances(entity: Entity_, maxDistance: number): PlayerDistance[] {
		const survivors: PlayerDistance[] = [];

		for (const survivor of ServerHelper.getSurvivors(entity.server)) {
			const distance = survivor.distanceToEntity(entity as any);
			if (distance >= maxDistance) continue;

			survivors.push({ player: survivor, distance: distance });
		}
		return survivors;
	}

	public static scaleHealthByPlayers(entity: LivingEntity_, baseHealth: number, playerCount: number): void {
		const last = entity.persistentData.getInt("last_scale_health_player_count");
		if (playerCount === last) return;
		entity.persistentData.putInt("last_scale_health_player_count", playerCount);

		const newMaxHealth = Math.max(1, playerCount) * baseHealth;
		LivingEntityHelper.scaleHealth(entity, newMaxHealth);
	}
}