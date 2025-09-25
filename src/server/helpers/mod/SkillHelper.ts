// @ts-ignore
/** @type {typeof import("java.util.Optional").$Optional } */
let $Optional = Java.loadClass("java.util.Optional");
/** @type {typeof import("net.puffish.skillsmod.api.Skill$State").$Skill$State } */
let $Skill$State = Java.loadClass("net.puffish.skillsmod.api.Skill$State");
//@ts-ignore
/** @type {typeof import("net.puffish.skillsmod.api.SkillsAPI").$SkillsAPI$$Original} */
let $SkillsAPI = Java.loadClass("net.puffish.skillsmod.api.SkillsAPI");

interface SkillTierHolder {
	player: ServerPlayer;
	tier: integer;
}

class SkillHelper {
	private static getState(player: ServerPlayer, skill: Skill) {
		const maybeCategory = $SkillsAPI.getCategory(
			$ResourceLocation.parse(skill.getCategoryId())
		);
		if (maybeCategory.isEmpty()) return null;

		const maybeSkill = maybeCategory.get().getSkill(skill.getSkillId());
		if (maybeSkill.isEmpty()) return null;

		return maybeSkill.get().getState(player);
	}

	public static hasSkill(player: ServerPlayer, skill: Skill): boolean {
		return this.getState(player, skill) === $Skill$State.UNLOCKED;
	}

	public static asPlayerWithSkill(entity: unknown, skill: Skill): ServerPlayer | null {
		return entity instanceof $ServerPlayer && this.hasSkill(entity, skill)
			? entity
			: null;
	}

	public static asPlayerWithSkills(entity: unknown, ...skills: Skill[]): ServerPlayer | null {
		return entity instanceof $ServerPlayer && skills.every(skill => SkillHelper.hasSkill(entity, skill))
			? entity
			: null;
	}

	public static asPlayerWithSkillTier(entity: unknown, ...skills: Skill[]): SkillTierHolder | null {
		if (!(entity instanceof $ServerPlayer)) return null;

		const tier = this.getSkillTier(entity, ...skills);
		return { player: entity, tier };
	}

	public static getSkillTier(player: ServerPlayer, ...skills: Skill[]): integer {
		for (let i = skills.length - 1; i >= 0; i--) {
			if (this.hasSkill(player, skills[i])) {
				return i + 1;
			}
		}
		return 0;
	}
}