

/**
 * @throws {UnsellableItemError}
 */
class ItemSellValueCalculator {

	public static calculate(server: MinecraftServer_, mItem: MarketableItem, player: ServerPlayer_): number {
		return new this(server, mItem, player).sellPrice;
	}

	private readonly server: MinecraftServer_;
	private readonly mItem: MarketableItem;
	private readonly player: ServerPlayer_;
	private sellPrice: number;

	private constructor(server: MinecraftServer_, mItem: MarketableItem, player: ServerPlayer_) {
		this.server = server;
		this.mItem = mItem;
		this.player = player;

		const maybeSellPrice = mItem.getSellPrice();
		if (maybeSellPrice == null) {
			throw new UnsellableItemError();
		}
		this.sellPrice = maybeSellPrice;

		this.calculateDunestrider();
		this.calculateSludge();
	}

	private calculateDunestrider() {
		if (!RaceHelper.isRace(this.player, Races.DUNESTRIDER)) return;

		if (SkillHelper.hasSkill(this.player, DunestriderSkills.SCAVENGER)) {
			let scavengerItems = [
				'minecraft:rotten_flesh',
				'minecraft:spider_eye',
				'minecraft:arrow',
				'minecraft:string',
				'minecraft:ender_pearl',
				'cataclysm:lacrima',
				'minecraft:feather',
				'minecraft:armadillo_scute'
			];
			if (!scavengerItems.includes(this.mItem.getItemId())) return;

			this.sellPrice *= 2;
		}
	}

	private calculateSludge() {
		if (!RaceHelper.isRace(this.player, Races.SLUDGE)) return;

		if (SkillHelper.hasSkill(this.player, SludgeSkills.NATURAL_ECONOMIST)) {
			if (this.mItem.getItemId() === "minecraft:slime_ball") {
				this.sellPrice *= 2;
			}
		}
	}

	/** @deprecated */
	private calculateStock() {
		if (!this.mItem.canHaveStock()) return;

		const compoundingRate = this.mItem.getCompoundingRate();
		const compoundingPeriod = this.mItem.getCompoundingPeriod();
		if (compoundingRate == undefined || compoundingPeriod == undefined) return;

		let stockAmount = StockManager.getStock(this.server, this.mItem);
		this.sellPrice = Math.ceil(this.sellPrice * ((1 - compoundingRate) ** (stockAmount / compoundingPeriod)));
	}
}