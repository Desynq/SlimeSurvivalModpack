global.MoneyHelper = {};

/**
 * 
 * @param {double} number 
 * @returns {long}
 */
global.MoneyHelper.fromDollar = function(number) {
	return Math.floor(number * 100);
}

global.MoneyHelper.fromDollarWithCharm = function(number) {
	return (number - 0.01) * 100;
}

/**
 * @param {long} number
 * @returns {double}
 */
global.MoneyHelper.toDollar = function(number) {
	return number / 100;
}

/**
 * Converts the inputted number to "$x.xx" format
 * @param {long} number
 * @returns {string}
 */
global.MoneyHelper.toDollarString = function(number) {
	const moneyFormatted = global.MoneyHelper.toDollar(Math.abs(number)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	return `${number < 0 ? '-' : ''}${moneyFormatted}`
}

/**
 * 
 * @param {long} number 
 * @returns {import("net.minecraft.network.chat.MutableComponent").$MutableComponent$$Original}
 */
global.MoneyHelper.toTextComponent = function(number) {
	return Component.darkGreen("$" + global.MoneyHelper.toDollarString(number));
}

/**
 * Converts strings formatted as "1", "1.2", or "1.23" into a whole number representing dollars and cents
 * ex: "1.23" -> 123, "1.2" -> 120, "1" -> 100
 * @param {string} dollarString
 * @returns {long | null}
 */
global.MoneyHelper.fromSimpleDollarString = function(dollarString) {
	const regex = /^\d+(\.\d{1,2})?$/;
	if (!regex.test(dollarString)) {
		return null;
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