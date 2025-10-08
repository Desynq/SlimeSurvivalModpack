//priority: 1000



class Skill {

	private readonly isDefaultSkill: boolean;

	public constructor(
		private readonly categoryId: string,
		private readonly skillId: string,
		isDefault: boolean | null
	) {
		this.isDefaultSkill = typeof isDefault === 'boolean' ? isDefault : false;
	}

	public getCategoryId() {
		return this.categoryId;
	};

	public getSkillId() {
		return this.skillId;
	};

	public isDefault() {
		return this.isDefaultSkill;
	};

	public register(registry: this[]) {
		registry.push(this);
		return this;
	}

	public isUnlockedFor(player: unknown): boolean {
		return SkillHelper.hasSkill(player, this);
	}

	public isLockedFor(player: unknown): boolean {
		return !SkillHelper.hasSkill(player, this);
	}
}