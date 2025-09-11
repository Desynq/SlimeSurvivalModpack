//priority: 1

/**
 * 
 * @param {string} skillId 
 * @param {string} traitId 
 * @param {boolean?} isDefault
 */
function Skill(skillId, traitId, isDefault) {
	this.skillId = skillId;
	this.traitId = traitId;
	this.default = typeof isDefault === 'boolean' ? isDefault : false;
}

Skill.prototype.getId = function() {
	return this.skillId;
}

Skill.prototype.getTraitId = function() {
	return this.traitId;
}

Skill.prototype.isDefault = function() {
	return this.default;
}