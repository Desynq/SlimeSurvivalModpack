//priority: 1000

type SkillData = Record<string, unknown>;
type EmptySkillData = Record<never, never>;

class Skill<D extends SkillData = EmptySkillData> {

	private readonly isDefaultSkill: boolean;
	public readonly data: Readonly<D>;

	public constructor(
		private readonly definitionId: string,
		private readonly categoryId: string,
		private readonly skillId: string,
		isDefault?: boolean | null,
		data?: D
	) {
		this.isDefaultSkill = typeof isDefault === 'boolean' ? isDefault : false;
		this.data = (data ?? {}) as D;
	}

	public getCategoryId() {
		return this.categoryId;
	}

	public getSkillId() {
		return this.skillId;
	}

	public isDefault() {
		return this.isDefaultSkill;
	}

	public getDefinitionId(): string {
		return this.definitionId;
	}

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

	public get(player: unknown): this | null {
		return this.isUnlockedFor(player) ? this : null;
	}

	public ifUnlocked(player: unknown): this | null;
	public ifUnlocked<R>(player: unknown, fn: (skill: this) => R): R | null;
	public ifUnlocked<R>(player: unknown, fn?: (skill: this) => R): R | this | null {

		if (this.isLockedFor(player)) {
			return null;
		}

		if (fn) {
			return fn(this);
		}

		return this;
	}
}