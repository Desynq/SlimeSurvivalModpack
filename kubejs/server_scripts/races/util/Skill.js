//priority: 1

/**
 * 
 * @param {string} skillId 
 * @param {string} tagId 
 * @param {boolean?} isDefault
 */
function Skill(skillId, tagId, isDefault) {
	this.skillId = skillId;
	this.tagId = tagId;
	this.default = typeof isDefault === 'boolean' ? isDefault : false;
}

Skill.prototype.getId = function() {
	return this.skillId;
}

Skill.prototype.getTagId = function() {
	return this.tagId;
}

Skill.prototype.isDefault = function() {
	return this.default;
}