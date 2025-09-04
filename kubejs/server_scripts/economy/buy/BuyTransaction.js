

/**
 * @public
 * @param {$ServerPlayer_} player 
 * @param {MarketableItem} mItem 
 * @param {integer} buyAmount must be > 0
 */
function BuyTransaction(player, mItem, buyAmount) {
	this.player = player;
	this.mItem = mItem;
	this.buyAmount = buyAmount;
	this.server = this.player.server;
	this.playerUuid = this.player.uuid.toString();

	if (this.mItem == null) {
		this.player.tell(Text.red("This item cannot be bought."));
		return;
	}

	this.itemCost = mItem.getCalculatedBuyPrice(this.server);
	if (this.itemCost == null) {
		this.player.tell(Text.red("This item cannot be bought."));
		return;
	}

	this.oldBalance = PlayerMoney.get(this.server, this.playerUuid);
	this.buyItem();
	this.tellOutput();
	this.logTransaction();
}

/**
 * @private
 */
BuyTransaction.prototype.buyItem = function() {
	this.server.runCommandSilent(`give ${this.player.username} ${this.mItem.getItemId()} ${this.buyAmount}`);

	if (this.mItem.canHaveStock() && (!this.player.creative || !this.player.spectator)) {
		StockManager.addToStock(this.server, this.mItem, -this.buyAmount);
	}

	this.totalCost = this.itemCost * this.buyAmount;
	PlayerMoney.add(this.server, this.playerUuid, -this.totalCost);
}

/**
 * @private
 */
BuyTransaction.prototype.tellOutput = function() {
	const totalCostString = MoneyManager.toDollarString(this.totalCost);
	const itemCostString = MoneyManager.toDollarString(this.itemCost);
	const oldBalanceString = MoneyManager.toDollarString(this.oldBalance);
	const newBalanceString = MoneyManager.toDollarString(PlayerMoney.get(this.server, this.playerUuid));

	this.player.tell(
		`> You bought ${this.buyAmount} ${this.mItem.getName()} for $${totalCostString} (${itemCostString} per).` +
		`\n  > Balance: $${oldBalanceString} -> $${newBalanceString}.`
	);
}

BuyTransaction.prototype.logTransaction = function() {
	const totalCostString = MoneyManager.toDollarString(this.totalCost);
	const itemCostString = MoneyManager.toDollarString(this.itemCost);

	tellOperators(this.server,
		Text.darkGray(`> Player ${this.player.username} bought ${this.buyAmount} ${this.mItem.getName()} for ${totalCostString} (${itemCostString} per)`).italic(true)
	);
}