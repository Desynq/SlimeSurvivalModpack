// priority: 1000
function Money() {}

/**
 * 
 * @param {number} number 
 * @returns {number}
 */
Money.FromDollar = function (number) {
	return number * 100;
}

Money.FromDollarWithCharm = function (number) {
	return (number - 0.01) * 100;
}

/**
 * @param {number} number
 * @returns {number}
 */
Money.ToDollar = function (number) {
	return number / 100;
}

/**
 * Converts the inputted number to "$x.xx" format
 * @param {number} number
 * @returns {string}
 */
Money.ToDollarString = function (number) {
	const moneyFormatted = Money.ToDollar(Math.abs(number)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	return `${number < 0 ? '-' : ''}${moneyFormatted}`
}

/**
 * Converts strings formatted as "1", "1.2", or "1.23" into a whole number representing dollars and cents
 * ex: "1.23" -> 123, "1.2" -> 120, "1" -> 100
 * @param {string} dollarString 
 */
Money.FromSimpleDollarString = function (dollarString) {
	const regex = /^\d+(\.\d{1,2})?$/;
	if (!regex.test(dollarString)) {
		return NaN;
	}

	const parts = dollarString.split('\\.');
	if (parts.length === 1) { // 1
		return parseInt(parts[0], 10) * 100;
	}
	if (parts[1].length === 1) { // 1.0
		return parseInt(parts[0] + parts[1], 10) * 10;
	}
	return parseInt(parts[0] + parts[1], 10); // 1.00
}