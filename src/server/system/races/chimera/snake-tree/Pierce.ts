

namespace Chimera.PierceSkill {

	export function getDurationNeeded(player: ServerPlayer_) {
		return 40.0;
	}


	const pierceTimestamp = new EntityTimestamp("chimera.pierce", 1);

	export function procPierce(player: ServerPlayer_): void {
		pierceTimestamp.update(player);
	}

	export function isPierceActive(player: ServerPlayer_): boolean {
		return pierceTimestamp.getDiff(player) === 0;
	}

	export function setPierce(arrow: AbstractArrow_): void {
		arrow.tags.add("chimera.pierce");
	}

	export function hasPierce(arrow: AbstractArrow_): boolean {
		return arrow.tags.contains("chimera.pierce");
	}

	export function notifyPierceReady(player: ServerPlayer_): void {
		PlaysoundHelper.playsoundAhead(player, "item.crossbow.loading_middle", "player", 1, 1);
	}
}