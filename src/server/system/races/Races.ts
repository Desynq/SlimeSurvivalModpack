// priority: 100

class Races {
	public static readonly INSTANCES: Race[] = [];

	public static readonly HUMAN = this.create("human", undefined, true);
	public static readonly SLUDGE = this.create("sludge", SludgeSkills);
	public static readonly FARLANDER = this.create("farlander", FarlanderSkills);
	public static readonly CHIMERA = this.create("chimera", ChimeraSkills);
	public static readonly DUNESTRIDER = this.create("dunestrider", DunestriderSkills);
	public static readonly SCULKER = this.create("sculker", SculkerSkills);

	public static getRaces() {
		return this.INSTANCES;
	}

	public static defaultRace() {
		const race = this.INSTANCES.find(race => race.isDefault());
		if (race === undefined) {
			throw new Error("No default race has been registered.");
		}
		return race;
	}

	/**
	 * @param {string} raceId 
	 */
	public static fromId(raceId: string) {
		return this.INSTANCES.find(race => race.getRaceId() === raceId);
	}

	private static register(race: Race) {
		this.INSTANCES.push(race);
		return race;
	}

	private static create(raceId: string, skillManager: SkillManager | undefined, isDefault?: boolean): Race {
		return this.register(new Race(raceId, skillManager, isDefault));
	}
}