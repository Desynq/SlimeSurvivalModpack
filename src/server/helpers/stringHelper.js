// priority: 1000
/**
 * @returns {string}
 */
function ConcatString() {
	return Array.prototype.join.call(arguments, "");
}

/**
 * 
 * @param {string} string 
 * @returns 
 */
function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * 
 * @param {number} number 
 */
function toRoman(number) {
	/** @type {[string, number][]} */
	const romans = [
		["M", 1000], ["CM", 900], ["D", 500], ["CD", 400], ["C", 100], ["XC", 90],
		["L", 50], ["XL", 40], ["X", 10], ["IX", 9], ["V", 5], ["IV", 4], ["I", 1]
	];
	let result = "";
	for (let i = 0; i < romans.length; i++) {
		while (number >= romans[i][1]) {
			result += romans[i][0];
			number -= romans[i][1];
		}
	}
	return result;
}