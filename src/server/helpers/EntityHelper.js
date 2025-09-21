
const EntityHelper = {}



/**
 * 
 * @param {$Entity_} entity 
 * @param {string} dimension 
 * @returns {boolean}
 */
EntityHelper.isInDimension = function(entity, dimension) {
	return entity.level.dimension.toString() == dimension;
}

/**
 * 
 * @param {$Entity_} entity 
 * @returns {boolean}
 */
EntityHelper.isInOverworld = function(entity) {
	return EntityHelper.isInDimension(entity, "minecraft:overworld");
}


/**
 * 
 * @param {$Entity_} entity
 * @returns {boolean}
 */
EntityHelper.isInLowOrbit = function(entity) {
	return EntityHelper.isInOverworld(entity) && entity.y >= 200;
}