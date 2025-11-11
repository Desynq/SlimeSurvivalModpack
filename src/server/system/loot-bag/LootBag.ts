// priority: 100

abstract class LootBag {

	protected readonly type: string;

	public constructor(
		public readonly id: string
	) {
		this.type = `lootbag.${id}`;
	}

	public abstract open(player: ServerPlayer_): void;
}