/** @type {typeof import("net.minecraft.core.registries.BuiltInRegistries").$BuiltInRegistries } */
let $BuiltInRegistries = Java.loadClass("net.minecraft.core.registries.BuiltInRegistries")

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
SellTransaction.prototype.sellAmount = undefined;

/** @type {number} */
SellTransaction.prototype.amountSold = undefined;

/** @type {number} */
SellTransaction.prototype.itemValue = undefined;

/** @type {number} */
SellTransaction.prototype.totalValue = undefined;

/** @type {number} */
SellTransaction.prototype.oldBalance = null;



/**
 * 
 * @param {$ServerPlayer_} player
 * @param {MarketableItem} mItem
 * @param {number | null} sellAmount 0 = sell itemstack in hand
 * @returns {void}
 */
function SellTransaction(player, mItem, sellAmount) {
	this.player = player;
	this.server = player.server;

	this.mItem = mItem;
	if (this.mItem == null) { // should only occur when doing `/sell hand` with a non-marketable item
		this.player.tell(Text.red("Item cannot be sold."));
		return;
	}

	this.itemId = mItem.getItemId();

	if (sellAmount == null) {
		this.sellAmount = 2147483647;
	}
	else if (sellAmount < 0) {
		this.player.tell(Text.red("Sell an actual quantity next time."));
		return;
	}
	else {
		this.sellAmount = sellAmount;
	}

	this.itemValue = SellTransaction.getItemValue(this.server, this.mItem, this.player);
	if (this.itemValue == null) {
		this.player.tell(Text.red("This item cannot be sold."));
		return;
	}

	this.oldBalance = PlayerMoney.get(this.server, this.player.uuid.toString()); // used for text output
	this.sellItem();
	this.tellOutput();
	this.logTransaction();
}

SellTransaction.prototype.logTransaction = function() {
	tellOperators(this.server,
		Text.darkGray(`> Player ${this.player.username} sold ${this.amountSold} ${this.mItem.getName()} for ${MoneyManager.toDollarString(this.totalValue)}`).italic(true)
	);
}

/**
 * Applies changes to the player and the server in order to simulate selling the item
 * NONE of what's in this method can fail otherwise players can potentially gain money illegally or sell items without compensation or lose sell value
 */
SellTransaction.prototype.sellItem = function() {
	if (this.sellAmount == 0) {
		const selectedStack = this.player.getMainHandItem();

		this.amountSold = selectedStack.getCount();
		selectedStack.setCount(0);
	}
	else {
		const rl = $ResourceLocation.parse(this.itemId);
		const item = $BuiltInRegistries.ITEM.get(rl);
		const itemCount = this.player.inventory.countItem(item);
		this.amountSold = Math.min(this.sellAmount, itemCount);

		this.server.runCommandSilent(`clear ${this.player.username} ${this.itemId} ${this.sellAmount}`);
	}

	if (this.mItem.canHaveStock() && (!this.player.creative || !this.player.spectator)) {
		StockManager.addToStock(this.server, this.mItem, this.amountSold);
	}

	this.totalValue = this.amountSold * this.itemValue;
	PlayerMoney.add(this.server, this.player.uuid.toString(), this.totalValue);
}



/**
 * @param {MinecraftServer} server 
 * @param {MarketableItem} mItem
 * @param {ServerPlayer} player
 * @returns {number | null}
 */
SellTransaction.getItemValue = function(server, mItem, player) {
	let sellPrice = mItem.getSellPrice();

	if (sellPrice == null) {
		return null;
	}

	sellPrice = SellTransaction.getItemValueRace(server, mItem, player, sellPrice);

	if (!mItem.canHaveStock()) {
		return sellPrice;
	}

	const compoundingRate = mItem.getCompoundingRate();
	const compoundingPeriod = mItem.getCompoundingPeriod();

	let stockAmount = StockManager.getStock(server, mItem);

	return Math.ceil(sellPrice * ((1 - compoundingRate) ** (stockAmount / compoundingPeriod)));
}

/**
 * 
 * @param {MinecraftServer} server 
 * @param {MarketableItem} mItem 
 * @param {ServerPlayer} player 
 * @param {number} sellPrice the item's default sell price
 * @returns {number}
 */
SellTransaction.getItemValueRace = function(server, mItem, player, sellPrice) {
	if (PlayerRaceHelper.isRace(player, Races.DUNESTRIDER)) {
		if (!(SkillHelper.hasSkill(player, DunestriderSkills.SCAVENGER))) return sellPrice;
		let scavengerItems = [
			'minecraft:slime_ball',
			'minecraft:rotten_flesh',
			'minecraft:spider_eye',
			'minecraft:arrow',
			'minecraft:string',
			'minecraft:ender_pearl',
			'cataclysm:lacrima',
			'minecraft:feather'
		]
		if (scavengerItems.includes(mItem.getItemId())) return sellPrice * 2;
	}
	return sellPrice;
}

SellTransaction.prototype.tellOutput = function() {
	const cAmountSold = Component.yellow(this.amountSold + "x");
	const cItemName = Component.gold(this.mItem.getName());
	const cTotalValue = MoneyManager.toTextComponent(this.totalValue);
	const cIndividualValue = MoneyManager.toTextComponent(this.itemValue);
	const cAmountSold2 = Component.yellow(`${this.amountSold}`);
	const cNewBalance = MoneyManager.toTextComponent(PlayerMoney.get(this.server, this.player.uuid.toString()));
	const cOldBalance = MoneyManager.toTextComponent(this.oldBalance);

	// Sold 64x baked_potato for $64.00 ($1.00 x 64).
	// Your balance is now $100.00 (previously $46.00).
	this.player.tell(
		Component.join(Component.gray("Sold "), cAmountSold, Component.gray(" "), cItemName, Component.gray(" for "), cTotalValue, Component.gray(" ("), cIndividualValue, Component.gray(" x "), cAmountSold2,
			Component.gray(").\nYour balance is now "), cNewBalance, Component.gray(" (previously "), cOldBalance, Component.gray(").")
		));
}