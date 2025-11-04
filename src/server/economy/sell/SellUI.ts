
class SellUI {
	public static outputReceipt(player: ServerPlayer_, receipt: SellReceipt) {
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

	public static outputXpReceipt(player: ServerPlayer_, receipt: SellXpReceipt): void {
		const text = (msg: string) => Component.of(msg);
		const yellow = (msg: string) => Component.yellow(msg);
		const gold = (msg: string) => Component.gold(msg);

		player.tell(
			Component.gray("")
				.append(text("Sold "))
				.append(yellow(`${receipt.xpSold}`))
				.append(text(" xp"))
		);
	}

	public static outputError(player: ServerPlayer_, error: unknown) {
		if (error instanceof UnsellableItemError) {
			player.tell(Text.red("Item cannot be sold"));
		}
		else if (error instanceof InvalidSellQuantityError) {
			player.tell(Text.red("Specified an incorrect sell quantity."));
		}
		else if (error instanceof InsufficientXpError) {
			player.tell(Text.red("You do not have enough xp."));
		}
		else if (error instanceof NoExperentialSkillError) {
			player.tell(Text.red("You must have the Experential skill in order to sell xp."));
		}
	}
}