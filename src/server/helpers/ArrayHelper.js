const ArrayHelper = {};

/**
 * @template T
 * @param {T[]} array 
 * @param {T} element 
 */
ArrayHelper.includes = function(array, element) {
	return array.indexOf(element) !== -1;
}