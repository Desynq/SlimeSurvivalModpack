
class SellUI {
	public static outputReceipt(player: ServerPlayer, receipt: SellReceipt) {
		const text = (msg: string) => Component.of(msg);
		const yellow = (msg: string) => Component.yellow(msg);
		const gold = (msg: string) => Component.gold(msg);

		player.tell(
			Component.gray("")
				.append(text("Sold "))
				.append(yellow(`${receipt.amountSold}x`))
				.append(text(" "))
				.append(gold(receipt.itemName))
				.append(text(" for "))
				.append(MoneyManager.toTextComponent(receipt.totalValue))
				.append(text(" ("))
				.append(MoneyManager.toTextComponent(receipt.itemValue))
				.append(text(" x "))
				.append(yellow(`${receipt.amountSold}`))
				.append(text(").\nYour balance is now "))
				.append(MoneyManager.toTextComponent(receipt.newBalance))
				.append(text(" (previously "))
				.append(MoneyManager.toTextComponent(receipt.oldBalance))
				.append(text(")."))
		);
	}

	public static outputError(player: ServerPlayer, error: UnsellableItemError | InvalidSellQuantityError) {
		if (error instanceof UnsellableItemError) {
			player.tell(Text.red("Item cannot be sold"));
		}
		else if (error instanceof InvalidSellQuantityError) {
			player.tell(Text.red("Specified an incorrect sell quantity."));
		}
	}
}