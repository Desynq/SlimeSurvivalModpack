/**
 * @returns {string}
 */
function ConcatString() {
	return Array.prototype.join.call(arguments, "");
}