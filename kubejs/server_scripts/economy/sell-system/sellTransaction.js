let $KubeResourceLocation = Java.loadClass("dev.latvian.mods.kubejs.util.KubeResourceLocation");
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

/** @type {string[]} */
SellTransaction.prototype.items = undefined;

/** @type {number} */
SellTransaction.prototype.amountToSell = undefined;

/** @type {number} */
SellTransaction.prototype.amountSold = undefined;

/** @type {number} */
SellTransaction.prototype.itemValue = undefined

/** @type {number} */
SellTransaction.prototype.totalValue = undefined;



function SellTransaction(context, sellAll) {
	this.context = context;
	this.player = this.context.source.player;
	this.server = this.player.server;

	this.sellAll = sellAll;

	this.itemId = $Arguments.STRING.getResult(this.context, "item");
	this.items = Object.keys(SELLABLE_ITEMS);


	if (this.items.indexOf(this.itemId) === -1) {
		this.player.tell(Text.red("Sell an actual item next time."));
		return;
	}

	if (this.sellAll) {
		this.amountToSell = 2147483647;
	}
	else {
		this.amountToSell = $Arguments.INTEGER.getResult(this.context, "amount");
		if (this.amountToSell <= 0) {
			this.player.tell(Text.red("Sell an actual quantity next time."));
			return;
		}
	}

	this.itemValue = SellTransaction.getRealItemValue(this.server, this.itemId);
	if (this.itemValue === null || this.itemValue === undefined) {
		this.player.tell(Text.darkRed("Something went horribly wrong"));
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
	tellOperators(this.server, this.amountSold);

	if (!this.player.creative || !this.player.spectator) {
		SellTracker.addSold(this.server, this.itemId, this.amountSold);
	}
	this.totalValue = this.amountSold * this.itemValue;
	PlayerMoney.add(this.server, this.player.uuid.toString(), this.totalValue);
}




/**
 * @param {$MinecraftServer_} server 
 * @param {string} item
 * @returns {number}
 */
SellTransaction.getRealItemValue = function (server, item) {
	const itemEntry = SELLABLE_ITEMS[item];
	const baseValue = itemEntry[0];
	const percentageLoss = itemEntry[1];
	const exponentialGroup = itemEntry[2];

	if (percentageLoss === undefined || exponentialGroup === undefined) {
		return baseValue;
	}

	let globalAmountSold = SellTracker.getSold(server, item);

	return Math.ceil(baseValue * ((1 - percentageLoss) ** (globalAmountSold / exponentialGroup)));
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