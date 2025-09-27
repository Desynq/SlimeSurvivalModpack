// priority: 900
/** @type {MarketableItem[]} */
MarketableItem._instances = [];

/** @type {MarketableItem[]} */
MarketableItem._sellableInstances = [];

/** @type {MarketableItem[]} */
MarketableItem._buyableInstances = [];

/** @type {Object.<string, MarketableItem>} */
MarketableItem._instancesById = {};

/** @type {Object.<string, MarketableItem} */
MarketableItem._instancesByName = {}

MarketableItem.getItems = function() {
	return MarketableItem._instances;
}

MarketableItem.getSellableItems = function() {
	if (MarketableItem._sellableInstances.length == 0) {
		MarketableItem._sellableInstances = MarketableItem._instances.filter(x => x._sellPrice != null);
	}
	return MarketableItem._sellableInstances;
}

MarketableItem.getBuyableItems = function() {
	if (MarketableItem._buyableInstances.length == 0) {
		MarketableItem._buyableInstances = MarketableItem._instances.filter(x => x._buyPrice != null);
	}
	return MarketableItem._buyableInstances;
}

/**
 * @param {string | null} itemId
 * @returns {MarketableItem | undefined}
 */
MarketableItem.fromId = function(itemId) {
	return MarketableItem._instancesById[itemId];
}

/**
 * 
 * @param {string | null} itemName 
 * @returns {MarketableItem | undefined}
 */
MarketableItem.fromName = function(itemName) {
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

/** @type {number} */
MarketableItem.prototype._buyPrice = null;

function MarketableItem(name, itemId) {
	this._name = name;
	this._itemId = itemId;
}

MarketableItem.prototype.setCompoundingRate = function(compoundingRate) {
	this._compoundingRate = compoundingRate;
	return this;
}

MarketableItem.prototype.setCompoundingPeriod = function(compoundingPeriod) {
	this._compoundingPeriod = compoundingPeriod;
	return this;
}

/**
 * 
 * @param {number} sellPrice a decimal number (1.00 = $1.00)
 * @returns {MarketableItem}
 */
MarketableItem.prototype.setSellPrice = function(sellPrice) {
	this._sellPrice = MoneyManager.fromDollar(sellPrice);
	return this;
}

/**
 * 
 * @param {number} buyPrice a decimal number (1.00 = $1.00)
 * @returns {MarketableItem}
 */
MarketableItem.prototype.setBuyPrice = function(buyPrice) {
	this._buyPrice = MoneyManager.fromDollar(buyPrice);
	return this;
}

MarketableItem.prototype.register = function() {
	MarketableItem._instances.push(this);
	MarketableItem._instancesById[this._itemId] = this;
	MarketableItem._instancesByName[this._name] = this;
	return this;
}

MarketableItem.prototype.getSellPrice = function() {
	return this._sellPrice;
}

MarketableItem.prototype.getBuyPrice = function() {
	return this._buyPrice;
}

/**
 * @param {MinecraftServer} server
 * @returns {long | null}
 */
MarketableItem.prototype.getCalculatedBuyPrice = function(server) {
	const buyPrice = this.getBuyPrice();

	if (buyPrice == null) {
		return null;
	}

	// todo: code stock integration for buy transactions when I re-enable the stock system
	return buyPrice;
}

MarketableItem.prototype.getCompoundingRate = function() {
	return this._compoundingRate;
}

MarketableItem.prototype.getCompoundingPeriod = function() {
	return this._compoundingPeriod;
}

MarketableItem.prototype.getName = function() {
	return this._name;
}

MarketableItem.prototype.getItemId = function() {
	return this._itemId;
}

MarketableItem.prototype.canHaveStock = function() {
	return this._compoundingRate != null && this._compoundingPeriod != null;
}