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
 * @param {string} categoryId 
 * @param {string} skillId
 */
SkillHelper.getState = function(player, categoryId, skillId) {
	/** @type {import("java.util.Optional").$Optional$$Original<import("net.puffish.skillsmod.api.Category").$Category$$Original>} */
	const maybeCategory = $SkillsAPI.getCategory($ResourceLocation.parse(categoryId));
	if (maybeCategory.isEmpty()) {
		return null;
	}
	const maybeSkill = maybeCategory.get().getSkill(skillId);
	if (maybeSkill.isEmpty()) {
		return null;
	}
	return maybeSkill.get().getState(player);
}

/**
 * 
 * @param {ServerPlayer} player 
 * @param {string} categoryId 
 * @param {string} skillId 
 * @returns 
 */
SkillHelper.hasSkill = function(player, categoryId, skillId) {
	return SkillHelper.getState(player, categoryId, skillId) === $Skill$State.UNLOCKED;
}