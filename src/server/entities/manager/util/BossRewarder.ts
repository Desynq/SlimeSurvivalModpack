// priority: 2

class BossRewarder<T extends LivingEntity_> {

	public constructor(
		private readonly racePoints: number
	) { }


	public addContributor(boss: T, player: ServerPlayer_): void {
		const contributorsTag = boss.persistentData.getCompound("contributors");
		if (contributorsTag.contains(player.stringUUID)) return;

		contributorsTag.putBoolean(player.stringUUID, true);
		boss.persistentData.put("contributors", contributorsTag);
	}

	/**
	 * @returns `true` if successfully rewarded at least one contributor.
	 */
	public rewardContributors(boss: T): boolean {
		const contributors = boss.persistentData.getCompound("contributors").getAllKeys();
		if (contributors.size() === 0) return false;

		contributors.forEach(stringUUID => {
			const player = boss.server.getEntityByUUID(stringUUID) as Entity_ | null;
			if (player instanceof $ServerPlayer) {
				this.rewardPlayer(boss, player);
			}
		});
		return true;
	}

	public resetContributors(boss: T): void {
		boss.persistentData.remove("contributors");
	}

	protected rewardPlayer(boss: T, player: ServerPlayer_) {
		PlayerRaceSkillHelper.addSkillPoint(player, this.racePoints);
	}
}