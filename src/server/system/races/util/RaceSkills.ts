// priority: 100

class RaceSkills {
	public static getFrom(race: Race): Skill[] {
		return race.getSkillManager()?.skills ?? [];
	}

	public static getDefaultFrom(race: Race) {
		return this.getFrom(race).filter(skill => skill.isDefault());
	}
}