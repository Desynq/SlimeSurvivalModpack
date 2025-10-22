// @ts-ignore
/** @type {typeof import("java.util.Optional").$Optional } */
let $Optional = Java.loadClass("java.util.Optional");
/** @type {typeof import("net.puffish.skillsmod.api.Skill$State").$Skill$State } */
let $Skill$State = Java.loadClass("net.puffish.skillsmod.api.Skill$State");
//@ts-ignore
/** @type {typeof import("net.puffish.skillsmod.api.SkillsAPI").$SkillsAPI$$Original} */
let $SkillsAPI = Java.loadClass("net.puffish.skillsmod.api.SkillsAPI");

interface SkillTierHolder {
	player: ServerPlayer_;
	tier: integer;
}

class SkillHelper {
	private static getState(player: ServerPlayer_, skill: Skill) {
		const maybeCategory = $SkillsAPI.getCategory(
			$ResourceLocation.parse(skill.getCategoryId())
		);
		if (maybeCategory.isEmpty()) return null;

		const maybeSkill = maybeCategory.get().getSkill(skill.getSkillId());
		if (maybeSkill.isEmpty()) return null;

		return maybeSkill.get().getState(player);
	}

	public static hasSkill(player: unknown, skill: Skill): boolean {
		return player instanceof $ServerPlayer && this.getState(player, skill) === $Skill$State.UNLOCKED;
	}

	public static asPlayerWithSkill(entity: unknown, skill: Skill): ServerPlayer_ | null {
		return entity instanceof $ServerPlayer && this.hasSkill(entity, skill)
			? entity
			: null;
	}

	public static asPlayerWithSkills(entity: unknown, ...skills: Skill[]): ServerPlayer_ | null {
		return entity instanceof $ServerPlayer && skills.every(skill => SkillHelper.hasSkill(entity, skill))
			? entity
			: null;
	}

	public static asPlayerWithSkillTier(entity: unknown, ...skills: Skill[]): SkillTierHolder | null {
		if (!(entity instanceof $ServerPlayer)) return null;

		const tier = this.getSkillTier(entity, ...skills);
		return { player: entity, tier };
	}

	/**
	 * Skills should go from the lowest tier skill to the highest tier skill
	 * @returns `0` if no skills, otherwise returns `i + 1` of the highest tier skill the player has unlocked
	 * 
	 * For example:
	 * `getSkillTier(player, skill1, skill2, skill3)` will return `3` if the player has `skill3`
	 */
	public static getSkillTier(player: ServerPlayer_, ...skills: Skill[]): integer {
		for (let i = skills.length - 1; i >= 0; i--) {
			if (this.hasSkill(player, skills[i])) {
				return i + 1;
			}
		}
		return 0;
	}

	/**
	 * A faster variant of {@link getSkillTier} for strictly sequential skill trees.
	 * 
	 * Assumes each tier must be unlocked in order; results are unreliable if any tier is skipped.
	 * Returns the index (1-based) of the highest unlocked skill, or 0 if none are unlocked.
	 */
	public static getSequentialSkillTier(player: ServerPlayer_, ...skills: Skill[]): integer {
		for (let i = 0; i < skills.length; i++) {
			if (skills[i].isLockedFor(player)) return i;
		}
		return skills.length;
	}

}