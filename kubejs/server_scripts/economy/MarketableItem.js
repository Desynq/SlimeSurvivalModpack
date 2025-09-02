// priority: 900
/** @type {MarketableItem[]} */
MarketableItem._instances = [];

/** @type {MarketableItem[]} */
MarketableItem._sellableInstances = [];

/** @type {Object.<string, MarketableItem>} */
MarketableItem._instancesById = {};

/** @type {Object.<string, MarketableItem} */
MarketableItem._instancesByName = {}

MarketableItem.getItems = function () {
	return MarketableItem._instances;
}

MarketableItem.getSellableItems = function () {
	if (MarketableItem._sellableInstances.length == 0) {
		MarketableItem._sellableInstances = MarketableItem._instances.filter(x => x._sellPrice != null);
	}
	return MarketableItem._sellableInstances;
}

/**
 * @param {string | null} itemId
 * @returns {MarketableItem | undefined}
 */
MarketableItem.fromId = function (itemId) {
	return MarketableItem._instancesById[itemId];
}

/**
 * 
 * @param {string | null} itemName 
 * @returns {MarketableItem | undefined}
 */
MarketableItem.fromName = function (itemName) {
	return MarketableItem._instancesByName[itemName];
}

/** @type {string} */
MarketableItem.prototype._name = null;

/** @type {string} */
MarketableItem.prototype._itemId = null;

/** @type {number} */
MarketableItem.prototype._compoundingRate = null;

/** @type {number} */
MarketableItem.prototype._compoundingPeriod = null;

/** @type {number} */
MarketableItem.prototype._sellPrice = null;

function MarketableItem(name, itemId) {
	this._name = name;
	this._itemId = itemId;
}

MarketableItem.prototype.setCompoundingRate = function (compoundingRate) {
	this._compoundingRate = compoundingRate;
	return this;
}

MarketableItem.prototype.setCompoundingPeriod = function (compoundingPeriod) {
	this._compoundingPeriod = compoundingPeriod;
	return this;
}

MarketableItem.prototype.setSellPrice = function (sellPrice) {
	this._sellPrice = Money.FromDollar(sellPrice);
	return this;
}

MarketableItem.prototype.register = function () {
	MarketableItem._instances.push(this);
	MarketableItem._instancesById[this._itemId] = this;
	MarketableItem._instancesByName[this._name] = this;
	return this;
}

MarketableItem.prototype.getSellPrice = function () {
	return this._sellPrice;
}

MarketableItem.prototype.getCompoundingRate = function () {
	return this._compoundingRate;
}

MarketableItem.prototype.getCompoundingPeriod = function () {
	return this._compoundingPeriod;
}

MarketableItem.prototype.getName = function () {
	return this._name;
}

MarketableItem.prototype.getItemId = function () {
	return this._itemId;
}

MarketableItem.prototype.canHaveStock = function () {
	return false; // disabled for now
	return this._compoundingRate != null && this._compoundingPeriod != null;
}