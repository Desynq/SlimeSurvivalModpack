const ObjectHelper = {};

/**
 * Ensures that the object's key is an array by assigning it an empty array if it isn't already assigned an array
 * @param {*} obj 
 * @param {*} key 
 */
ObjectHelper.ensureArray = function (obj, key) {
	if (!Array.isArray(obj[key])) {
		obj[key] = [];
	}
}


/**
 * Returns the array at the given key, or creates an empty array if it doesn't exist.
 * @param {Object} obj
 * @param {string|number} key
 * @returns {Array}
 */
ObjectHelper.getOrCreateArray = function (obj, key) {
	ObjectHelper.ensureArray(obj, key);
	return obj[key];
}