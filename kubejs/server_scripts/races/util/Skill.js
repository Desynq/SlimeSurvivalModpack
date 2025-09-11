//priority: 1

/**
 * 
 * @param {string} skillId 
 * @param {boolean?} isDefault
 */
function Skill(skillId, isDefault) {
	this.skillId = skillId;
	this.default = typeof isDefault === 'boolean' ? isDefault : false;
}

Skill.prototype.getId = function() {
	return this.skillId;
}

Skill.prototype.isDefault = function() {
	return this.default;
}