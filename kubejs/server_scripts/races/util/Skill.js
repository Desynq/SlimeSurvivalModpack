
/**
 * 
 * @param {string} skillId 
 * @param {string} tagId 
 */
function Skill(skillId, tagId) {
	this.skillId = skillId;
	this.tagId = tagId;
}

Skill.prototype.getSkillId = function() {
	return this.skillId;
}

Skill.prototype.getTagId = function() {
	return this.tagId;
}