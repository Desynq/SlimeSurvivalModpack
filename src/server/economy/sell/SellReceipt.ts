

class SellReceipt {
	public constructor(
		public readonly player: ServerPlayer,
		public readonly itemName: string,
		public readonly amountSold: number,
		public readonly itemValue: number,
		public readonly totalValue: number,
		public readonly oldBalance: number,
		public readonly newBalance: number
	) { }
}