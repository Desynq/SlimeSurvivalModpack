// priority: 2

class BossRewarder<T extends LivingEntity_> {

	private readonly KEY = "contributors";

	public constructor(
		private readonly racePoints: number
	) { }


	public addContributor(boss: T, player: ServerPlayer_): boolean {
		const contributorsTag = boss.persistentData.getCompound(this.KEY);
		if (contributorsTag.contains(player.stringUUID)) return false;

		contributorsTag.putBoolean(player.stringUUID, true);
		boss.persistentData.put("contributors", contributorsTag);
		return true;
	}

	public removeContributor(boss: T, player: ServerPlayer_): void {
		const contributorsTag = boss.persistentData.getCompound(this.KEY);
		contributorsTag.remove(player.stringUUID);
		boss.persistentData.put(this.KEY, contributorsTag);
	}

	public getContributors(boss: T): ServerPlayer_[] {
		const contributorStringUUIDs: string[] = boss.persistentData.getCompound(this.KEY).getAllKeys().toArray();
		const contributors: ServerPlayer_[] = [];
		for (const stringUUID of contributorStringUUIDs) {
			const player = boss.server.getEntityByUUID(stringUUID);
			if (player instanceof $ServerPlayer) {
				contributors.push(player);
			}
		}
		return contributors;
	}

	/**
	 * @returns `true` if successfully rewarded at least one contributor.
	 */
	public rewardContributors(boss: T): boolean {
		const contributors = this.getContributors(boss);
		if (contributors.length === 0) return false;

		for (const contributor of contributors) {
			this.rewardPlayer(boss, contributor);
		}
		return true;
	}

	public resetContributors(boss: T): void {
		boss.persistentData.remove(this.KEY);
	}

	protected rewardPlayer(boss: T, player: ServerPlayer_) {
		PlayerRaceSkillHelper.addSkillPoint(player, this.racePoints);
	}
}