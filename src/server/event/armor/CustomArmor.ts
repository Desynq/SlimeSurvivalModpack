



interface ArmorEquipped {
	queenBee: number;
	axolotl: number;
	turtle: number;
}

namespace CustomArmors {

	PlayerEvents.tick(e => {
		const player = e.player as ServerPlayer_;

		const equipped = calcArmorEquipped(player);
		tickQueenBeeArmor(player, equipped);
		tickAxolotlArmor(player, equipped);
		tickTurtleArmor(player, equipped);
	});

	const armorTypes = [
		"queenBee",
		"axolotl",
		"turtle"
	] as const;

	const flagMap = {
		queenBee: "bee_queen_armor",
		axolotl: "axolotl_armor",
		turtle: "turtle_armor"
	} as const;

	function calcArmorEquipped(player: ServerPlayer_): ArmorEquipped {
		const equipped: ArmorEquipped = {
			queenBee: 0,
			axolotl: 0,
			turtle: 0
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

	const axolotlHealCooldown = new EntityTimestamp<ServerPlayer_>("axolotl_armor.heal_cooldown");

	function tickAxolotlArmor(player: ServerPlayer_, equipped: ArmorEquipped): void {
		if (equipped.axolotl === 0) return;
		if (!player.alive) return;

		if (player.health >= player.maxHealth) return;

		const cooldown = 40 / equipped.axolotl;
		if (axolotlHealCooldown.tryReject(player, cooldown)) return;

		const factor = MathHelper.clamped(1 - player.health / player.maxHealth, 0, 1);

		const healValue = MathHelper.lerp(0, player.maxHealth * 0.05, factor);
		player.heal(healValue);
	}


	function tickTurtleArmor(player: ServerPlayer_, equipped: ArmorEquipped): void {
		if (equipped.turtle > 0 && player.crouching && player.onGround()) {

			const slowAmp = [0, 1, 2, 3][equipped.turtle - 1] ?? 3;

			LivingEntityHelper.addEffect(
				player,
				"minecraft:slowness",
				19,
				slowAmp,
				false,
				true,
				true,
				player
			);

			const resAmp = [null, 0, 0, 1][equipped.turtle - 1] ?? null;

			if (resAmp !== null) {
				LivingEntityHelper.addEffect(
					player,
					"minecraft:resistance",
					19,
					resAmp,
					false,
					true,
					true,
					player
				);
			}
		}
	}
}