


namespace PlayerHelper {

	export function isSurvivalLike(player: ServerPlayer_): boolean {
		return !player.creative && !player.spectator;
	}

	export function isOperator(player: ServerPlayer_): boolean {
		return player.permissionLevel >= 2;
	}



	export function isOnWhitelist(server: MinecraftServer_, uuid: import("java.util.UUID").$UUID$$Original | null) {
		return server
			.getPlayerList()
			.getWhiteList()
			.getEntries()
			.stream()
			.anyMatch(entry => entry
				.getUser()
				.getId()
				.equals(uuid)
			);
	}



	export function getPetsFollowing(player: ServerPlayer_): import("net.minecraft.world.entity.TamableAnimal").$TamableAnimal$$Original[] {
		return player.getLevel().getEntities()
			.stream()
			.filter(e => e instanceof $TamableAnimal && !e.isInSittingPose() && e.getOwner() == player)
			.toArray();
	}

	export function hasCuriosEquipped(player: ServerPlayer_, itemId: string): boolean {
		const item = $BuiltInRegistries.ITEM.get(itemId);
		return player.isCuriosEquipped(itemId);
	}

	export function canHeal(player: ServerPlayer_): boolean {
		return player.health > 0 && !player.isDeadOrDying();
	}

	export function feed(player: ServerPlayer_, sateAmount: number): void {
		const foodData = player.foodData;
		const maxFood = 20;
		const maxSaturation = 20;

		let food = foodData.foodLevel;
		let saturation = foodData.saturationLevel;
		if (food >= maxFood && saturation >= maxSaturation) return;

		const hungerToAdd = Math.min(sateAmount, maxFood - food);
		foodData.foodLevel = food + hungerToAdd;
		sateAmount -= hungerToAdd;

		if (sateAmount <= 0) return;

		const saturationToAdd = Math.min(sateAmount, maxSaturation - saturation);
		foodData.saturation = saturation + saturationToAdd;
	}



	export const wasLastFallFlying = (function () {
		const timestamps: Record<string, long | undefined> = {};

		function wasLastFallFlying(player: ServerPlayer_, ticks: long): boolean {
			const timestamp = timestamps[player.stringUUID];
			if (timestamp == undefined) {
				return false;
			}
			return TickHelper.getGameTime(player.server) - timestamp <= ticks;
		}

		PlayerEvents.tick(event => {
			if (event.player.isFallFlying()) {
				timestamps[event.player.stringUUID] = TickHelper.getGameTime(event.player.server);
			}
		});

		return wasLastFallFlying;
	})();
}