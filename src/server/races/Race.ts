// priority: 1000


class Race {

	public constructor(
		private readonly raceId: string,
		private readonly skillManager?: SkillManager,
		private readonly _isDefault: boolean = false
	) { }

	public getRaceId(): string {
		return this.raceId;
	}

	public isDefault(): boolean {
		return this._isDefault;
	}

	public getSkillManager(): SkillManager | undefined {
		return this.skillManager;
	}

	public getSkillCategoryId(): string {
		return `slimesurvival:${this.getRaceId()}_race`;
	}
}