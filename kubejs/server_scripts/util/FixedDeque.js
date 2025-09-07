/**
 * @template T
 * @class
 * @param {integer} size 
 */
function FixedDeque(size) {
	this.size = size;
	/** @type {Array<T>} */
	this.arr = [];
}

/**
 * @param {T} element 
 */
FixedDeque.prototype.push = function(element) {
	this.arr.push(element);
	if (this.arr.length > this.size) {
		this.arr.shift();
	}
}

/**
 * @returns {Array<T>}
 */
FixedDeque.prototype.get = function() {
	return this.arr;
}