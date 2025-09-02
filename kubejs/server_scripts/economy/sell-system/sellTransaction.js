/** @type {$CommandContext_<$CommandSourceStack_>} */
SellTransaction.prototype.context = undefined;

/** @type {$Player_} */
SellTransaction.prototype.player = undefined;

/** @type {$MinecraftServer_} */
SellTransaction.prototype.server = undefined;

/** @type {boolean} */
SellTransaction.prototype.sellAll = undefined;

/** @type {string} */
SellTransaction.prototype.itemId = undefined

/** @type {MarketableItem} */
SellTransaction.prototype.mItem = undefined;

/** @type {string[]} */
SellTransaction.prototype.items = undefined;

/** @type {number} */
SellTransaction.prototype.amountToSell = undefined;

/** @type {number} */
SellTransaction.prototype.amountSold = undefined;

/** @type {number} */
SellTransaction.prototype.itemValue = undefined;

/** @type {number} */
SellTransaction.prototype.totalValue = undefined;



/**
 * 
 * @param {$ServerPlayer_} player
 * @param {MarketableItem} mItem
 * @param {number | null} amountToSell 
 * @returns {void}
 */
function SellTransaction(player, mItem, amountToSell) {
	this.player = player;
	this.server = player.server;

	this.mItem = mItem;
	this.itemId = mItem.getItemId();


	if (this.mItem == null) {
		this.player.tell(Text.red("Sell an actual item next time."));
		return;
	}

	if (amountToSell == null) {
		this.amountToSell = 2147483647;
	}
	else if (amountToSell <= 0) {
		this.player.tell(Text.red("Sell an actual quantity next time."));
		return;
	}
	else {
		this.amountToSell = amountToSell;
	}

	this.itemValue = SellTransaction.getItemValue(this.server, this.mItem);
	if (this.itemValue == null) {
		this.player.tell(Text.red("This item cannot be sold."));
		return;
	}

	this.sellItem();
	this.tellOutput();
	this.logTransaction();
}

SellTransaction.prototype.logTransaction = function () {
	tellOperators(this.server, Text.gray(`Player ${this.player.username} sold ${this.amountSold} ${this.itemId} for ${Money.ToDollarString(this.totalValue)}`));
}

/**
 * Applies changes to the player and the server in order to simulate selling the item
 * NONE of what's in this method can fail otherwise players can potentially gain money illegally or sell items without compensation or lose sell value
 */
SellTransaction.prototype.sellItem = function () {
	const rl = $ResourceLocation.parse(this.itemId);
	const item = $BuiltInRegistries.ITEM.get(rl);
	const itemCount = this.player.inventory.countItem(item);
	this.amountSold = Math.min(this.amountToSell, itemCount);

	this.server.runCommandSilent(`clear ${this.player.username} ${this.itemId} ${this.amountToSell}`);

	if (this.mItem.canHaveStock() && (!this.player.creative || !this.player.spectator)) {
		StockManager.addToStock(this.server, this.mItem, this.amountSold);
	}

	this.totalValue = this.amountSold * this.itemValue;
	PlayerMoney.add(this.server, this.player.uuid.toString(), this.totalValue);
}




/**
 * @param {$MinecraftServer_} server 
 * @param {MarketableItem} mItem
 * @returns {number | null}
 */
SellTransaction.getItemValue = function (server, mItem) {
	const sellPrice = mItem.getSellPrice();

	if (sellPrice == null) {
		return null;
	}

	if (!mItem.canHaveStock()) {
		return sellPrice;
	}

	const compoundingRate = mItem.getCompoundingRate();
	const compoundingPeriod = mItem.getCompoundingPeriod();

	let stockAmount = StockManager.getStock(server, mItem);

	return Math.ceil(sellPrice * ((1 - compoundingRate) ** (stockAmount / compoundingPeriod)));
}

SellTransaction.prototype.tellOutput = function () {
	const output =
		`${'-'.repeat(32)}\n` +
		`Individual Value: $${(this.itemValue / 100).toFixed(2)}\n` +
		`Sold: ${this.amountSold}\n` +
		`Total Value: $${(this.totalValue / 100).toFixed(2)}\n` +
		`${'-'.repeat(32)}`
		;

	this.player.tell(output);
}