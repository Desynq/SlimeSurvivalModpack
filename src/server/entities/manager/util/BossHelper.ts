// priorty: 2

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
}