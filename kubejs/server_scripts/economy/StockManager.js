const StockManager = {
	/**
	 * @param {$MinecraftServer_} server
	 * @param {MarketableItem} item
	 * @returns {number}
	 */
	getStock(server, item)
	{
		if (!item.canHaveStock()) {
			throw new Error("Item does not have stock.");
		}
		return server.persistentData.getCompound('items_sold').getDouble(item.getItemId()) ?? 0;
	},


	/**
	 * @param {$MinecraftServer_} server
	 * @param {MarketableItem} item 
	 * @param {number} newAmount 
	 */
	updateStock(server, item, newAmount)
	{
		if (!item.canHaveStock()) {
			throw new Error("Item does not have stock.");
		}

		let compoundTag = server.persistentData.getCompound('items_sold');

		if (compoundTag.empty)
		{
			server.persistentData.put('items_sold', new $CompoundTag());
			compoundTag = server.persistentData.getCompound('items_sold');
		}

		compoundTag.putDouble(item.getItemId(), newAmount);
	},


	/**
	 * @param {$MinecraftServer_} server
	 * @param {MarketableItem} item 
	 * @param {number} amount 
	 */
	addToStock(server, item, amount)
	{
		if (!item.canHaveStock()) {
			throw new Error("Item does not have stock.");
		}

		let stockAmount = StockManager.getStock(server, item);
		StockManager.updateStock(server, item, stockAmount + amount);
	},


	/**
	 * @param {$MinecraftServer_} server
	 * @param {number} percentageLost percentage of items to diminish the stocks by
	 */
	diminishStocks(server, percentageLost)
	{
		MarketableItem._instances.forEach(item => {
			if (!item.canHaveStock()) {
				return;
			}
			let stockAmount = StockManager.getStock(server, item);
			stockAmount *= 1 - percentageLost;
			StockManager.updateStock(server, item, stockAmount);
		});
	}
}