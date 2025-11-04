
class InsufficientXpError extends Error {
	public constructor(message?) {
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);
		this.name = new.target.name;
	}
}

class NoExperentialSkillError extends Error {
	public constructor(message?) {
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);
		this.name = new.target.name;
	}
}

/**
 * @throws {InvalidSellQuantityError}
 */
class SellXpTransaction {
	private readonly player: ServerPlayer_;
	private readonly server: MinecraftServer_;
	private readonly oldXpBalance: integer;
	private readonly newXpBalance: integer;
	private readonly sellAmount: number;
	private readonly xpSold: number;
	private readonly totalValue: number;

	public constructor(player: ServerPlayer_, sellAmount: integer) {
		this.player = player;
		this.server = player.server;
		this.sellAmount = sellAmount;

		if (this.sellAmount < 1) {
			throw new InvalidSellQuantityError();
		}

		if (SculkerSkills.EXPERENTIAL.isLockedFor(player)) {
			throw new NoExperentialSkillError();
		}

		this.oldXpBalance = PlayerHelper.getTotalXp(this.player);

		if (this.oldXpBalance < this.sellAmount) {
			throw new InsufficientXpError();
		}

		this.totalValue = MoneyManager.fromDollar(this.sellAmount);

		this.xpSold = this.sellAmount;

		PlayerMoney.add(player.server, this.player.stringUUID, this.totalValue);
		this.player.giveExperiencePoints(-this.sellAmount);

		this.newXpBalance = PlayerHelper.getTotalXp(this.player);

		this.logTransaction();
	}

	public getReceipt(): SellXpReceipt {
		return new SellXpReceipt(
			this.player,
			this.xpSold,
			this.oldXpBalance,
			this.newXpBalance
		);
	}

	private logTransaction(): void {
		tellOperators(
			this.server, // @ts-ignore
			Text.darkGray(
				`> Player ${this.player.username} sold ${this.xpSold} xp for ${MoneyManager.toDollarString(this.totalValue)}`
			).italic(true)
		);
	}
}