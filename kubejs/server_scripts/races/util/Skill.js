//priority: 1000

/**
 * @param {string} categoryId
 * @param {string} skillId 
 * @param {boolean?} isDefault
 */
function Skill(categoryId, skillId, isDefault) {
	this.categoryId = categoryId;
	this.skillId = skillId;
	this.default = typeof isDefault === 'boolean' ? isDefault : false;
}

Skill.prototype.getCategoryId = function() {
	return this.categoryId;
}

Skill.prototype.getSkillId = function() {
	return this.skillId;
}

Skill.prototype.isDefault = function() {
	return this.default;
}