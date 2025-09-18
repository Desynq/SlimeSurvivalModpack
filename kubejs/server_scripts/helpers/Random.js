const Random = {};

/**
 * 
 * @param {number} min inclusive
 * @param {number} max exclusive
 * @returns 
 */
Random.nextInt = function(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}