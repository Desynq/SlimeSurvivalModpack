const StockManager = {
	/**
	 * @param {$MinecraftServer_} server
	 * @param {string} itemName
	 * @returns {number}
	 */
	getStock(server, itemName)
	{
		return server.persistentData.getCompound('items_sold').getDouble(itemName);
	},


	/**
	 * @param {$MinecraftServer_} server
	 * @param {string} itemName 
	 * @param {number} newAmount 
	 */
	updateStock(server, itemName, newAmount)
	{
		let compoundTag = server.persistentData.getCompound('items_sold');

		if (compoundTag.empty)
		{
			server.persistentData.put('items_sold', new $CompoundTag());
			compoundTag = server.persistentData.getCompound('items_sold');
		}

		compoundTag.putDouble(itemName, newAmount);
	},


	/**
	 * @param {$MinecraftServer_} server
	 * @param {string} itemName 
	 * @param {number} amount 
	 */
	addToStock(server, itemName, amount)
	{
		let stockAmount = StockManager.getStock(server, itemName);
		StockManager.updateStock(server, itemName, stockAmount + amount);
	},


	/**
	 * @param {$MinecraftServer_} server
	 * @param {number} percentageLost percentage of items to diminish the stocks by
	 */
	diminishStocks(server, percentageLost)
	{
		Object.keys(SELLABLE_ITEMS).forEach(itemName => {
			let stockAmount = StockManager.getStock(server, itemName);
			stockAmount *= 1 - percentageLost;
			StockManager.updateStock(server, itemName, stockAmount);
		});
	}
}