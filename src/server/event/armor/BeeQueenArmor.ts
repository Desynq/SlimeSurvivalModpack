



interface ArmorEquipped {
	queenBee: number;
	axolotl: number;
}

namespace CustomArmors {

	PlayerEvents.tick(e => {
		const player = e.player as ServerPlayer_;

		const equipped = calcArmorEquipped(player);
		tickQueenBeeArmor(player, equipped);
		tickAxolotlArmor(player, equipped);
	});

	const armorTypes = [
		"queenBee",
		"axolotl"
	] as const;

	const flagMap = {
		queenBee: "bee_queen_armor",
		axolotl: "axolotl_armor"
	};

	function calcArmorEquipped(player: ServerPlayer_): ArmorEquipped {
		const equipped: ArmorEquipped = {
			queenBee: 0,
			axolotl: 0
		};

		const armor = player.getArmorSlots();
		armor.forEach(stack => {
			for (const type of armorTypes) {
				const flag = flagMap[type];
				if (StackHelper.isCustomFlagSet(stack, flag)) equipped[type]++;
			}
		});

		return equipped;
	}

	function tickQueenBeeArmor(player: ServerPlayer_, equipped: ArmorEquipped): void {
		if (equipped.queenBee === 0) return;

		for (const id of ["farmersdelight:comfort", "farmersdelight:nourishment"]) {
			LivingEntityHelper.addEffect(
				player,
				id,
				100,
				0,
				false,
				false,
				true,
				player
			);
		}
	}

	function tickAxolotlArmor(player: ServerPlayer_, equipped: ArmorEquipped): void {
		if (equipped.axolotl === 0) return;

		const amplifier = Math.floor((equipped.axolotl - 1) / 2);
		LivingEntityHelper.applyEffectUntilExpired(
			player,
			"minecraft:regeneration",
			100,
			20,
			amplifier,
			false,
			false,
			true,
			player
		);
	}
}