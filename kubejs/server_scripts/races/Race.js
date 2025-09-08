
/**
 * 
 * @param {string} raceId 
 * @param {boolean?} isDefault
 */
function Race(raceId, isDefault) {
	this.race = raceId;
	this.default = (typeof isDefault === 'boolean') ? isDefault : false;
}

Race.prototype.getRaceId = function() {
	return this.race;
};

Race.prototype.isDefault = function() {
	return this.default;
};