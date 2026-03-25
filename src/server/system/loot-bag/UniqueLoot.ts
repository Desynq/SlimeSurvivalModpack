// priority: 12

class UniqueLoot {
	public readonly has: (player: ServerPlayer_) => boolean;
	public readonly give: (player: ServerPlayer_) => void;

	public constructor({ has, give }: {
		has: (player: ServerPlayer_) => boolean;
		give: (player: ServerPlayer_) => void;
	}) {
		this.has = has;
		this.give = give;
	}

	public static asId(id: string): UniqueLoot {
		return new UniqueLoot({
			has: (player) => {
				for (const stack of player.inventory.allItems.toArray() as ItemStack_[]) {
					if (stack.id === id) return true;
				}
				return false;
			},
			give: (player) => {
				PlayerHelper.give(player, id);
			}
		});
	}

	public static asNbt({ id, customId, nbt, count = 1 }: {
		id: string;
		customId: string;
		nbt: string;
		count?: integer;
	}): UniqueLoot {
		return new UniqueLoot({
			has: (player) => {
				for (const stack of player.inventory.allItems.toArray() as ItemStack_[]) {
					if (StackHelper.isCustomItem(stack, customId)) return true;
				}
				return false;
			},
			give: (player) => {
				PlayerHelper.give(player, id, count, nbt);
			}
		});
	}
}