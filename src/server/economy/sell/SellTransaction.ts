
class UnsellableItemError extends Error {
	public constructor(message?) {
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);
		this.name = new.target.name;
	}
}
class InvalidSellQuantityError extends Error {
	public constructor(message?) {
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);
		this.name = new.target.name;
	}
}

/**
 * @throws {UnsellableItemError}
 * @throws {InvalidSellQuantityError}
 */
class SellTransaction {
	private readonly player: ServerPlayer_;
	private readonly server: MinecraftServer_;
	private readonly mItem: MarketableItem;
	private readonly itemId: string;
	private readonly itemValue: number;
	private readonly oldBalance: number;
	private readonly sellAmount: number;
	private amountSold: number = 0;
	private totalValue: number = 0;

	public constructor(player: ServerPlayer_, mItem?: MarketableItem, sellAmount?: number) {
		this.player = player;
		this.server = player.server;

		if (mItem == null) {
			throw new UnsellableItemError();
		}
		this.mItem = mItem;

		// throws if mItem is not sellable
		this.itemValue = ItemSellValueCalculator.calculate(this.server, this.mItem, this.player);

		if (sellAmount == null) {
			this.sellAmount = 2147483647;
		}
		else if (sellAmount < 0) {
			throw new InvalidSellQuantityError();
		}
		else {
			this.sellAmount = sellAmount;
		}

		this.itemId = mItem.getItemId();
		this.oldBalance = PlayerMoney.get(this.server, this.player.stringUUID);
		this.sellItem();

		this.logTransaction();
	}

	public getReceipt(): SellReceipt {
		return new SellReceipt(
			this.player,
			this.mItem.getName(),
			this.amountSold,
			this.itemValue,
			this.totalValue,
			this.oldBalance,
			PlayerMoney.get(this.server, this.player.stringUUID)
		);
	}

	private logTransaction(): void {
		tellOperators(
			this.server, // @ts-ignore
			Text.darkGray(
				`> Player ${this.player.username} sold ${this.amountSold} ${this.mItem.getName()} for ${MoneyManager.toDollarString(this.totalValue)}`
			).italic(true)
		);
	}

	/**
	 * Applies changes to the player and the server in order to simulate selling the item
	 * NONE of what's in this method can fail otherwise players can potentially gain money illegally or sell items without compensation or lose sell value
	 */
	private sellItem(): void {
		if (this.sellAmount == 0) {
			const selectedStack = this.player.getMainHandItem();

			this.amountSold = selectedStack.getCount();
			selectedStack.setCount(0);
		}
		else {
			const rl = $ResourceLocation.parse(this.itemId);
			// @ts-ignore
			const item = $BuiltInRegistries.ITEM.get(rl);
			const itemCount = this.player.inventory.countItem(item as any);
			this.amountSold = Math.min(this.sellAmount, itemCount);

			this.server.runCommandSilent(`clear ${this.player.username} ${this.itemId} ${this.sellAmount}`);
		}

		if (this.mItem.canHaveStock() && (!this.player.creative || !this.player.spectator)) {
			StockManager.addToStock(this.server, this.mItem, this.amountSold);
		}

		this.totalValue = this.amountSold * this.itemValue;
		PlayerMoney.add(this.server, this.player.uuid.toString(), this.totalValue);
	}
}
