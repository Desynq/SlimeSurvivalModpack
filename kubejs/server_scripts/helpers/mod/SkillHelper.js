// @ts-ignore
/** @type {typeof import("java.util.Optional").$Optional } */
let $Optional = Java.loadClass("java.util.Optional")
/** @type {typeof import("net.puffish.skillsmod.api.Skill$State").$Skill$State } */
let $Skill$State = Java.loadClass("net.puffish.skillsmod.api.Skill$State")
//@ts-ignore
/** @type {typeof import("net.puffish.skillsmod.api.SkillsAPI").$SkillsAPI$$Original} */
let $SkillsAPI = Java.loadClass("net.puffish.skillsmod.api.SkillsAPI");

const SkillHelper = {};

/**
 * 
 * @param {ServerPlayer} player 
 * @param {Skill} skill
 */
SkillHelper.getState = function(player, skill) {
	/** @type {import("java.util.Optional").$Optional$$Original<import("net.puffish.skillsmod.api.Category").$Category$$Original>} */
	const maybeCategory = $SkillsAPI.getCategory($ResourceLocation.parse(skill.getCategoryId()));
	if (maybeCategory.isEmpty()) {
		return null;
	}
	const maybeSkill = maybeCategory.get().getSkill(skill.getSkillId());
	if (maybeSkill.isEmpty()) {
		return null;
	}
	return maybeSkill.get().getState(player);
}

/**
 * 
 * @param {ServerPlayer} player 
 * @param {Skill} skill
 * @returns 
 */
SkillHelper.hasSkill = function(player, skill) {
	return SkillHelper.getState(player, skill) === $Skill$State.UNLOCKED;
}

/**
 * Returns the highest tier (index + 1) of the provided skills that the player has unlocked.
 * Skills are checked in reverse order; the first unlocked skill found determines the tier.
 * If none of the skills are unlocked, returns 0.
 *
 * @function
 * @param {ServerPlayer} player The player whose skills are being checked.
 * @param {...Skill} var_args A variable number of Skill objects, ordered by tier (lowest to highest).
 * @returns {number} The tier number (1-based index) of the highest unlocked skill, or 0 if none are unlocked.
 *
 * @example
 * // Given three skills: skill1 (tier 1), skill2 (tier 2), skill3 (tier 3)
 * const tier = SkillHelper.getSkillTier(player, skill1, skill2, skill3);
 * // If player has skill2 unlocked, returns 2
 */
SkillHelper.getSkillTier = function(player, var_args) {
	/** @type {Skill[]} */
	const skills = Array.prototype.slice.call(arguments, 1);
	for (let i = skills.length - 1; i >= 0; i--) {
		if (SkillHelper.hasSkill(player, skills[i])) {
			return i + 1;
		}
	}
	return 0;
}