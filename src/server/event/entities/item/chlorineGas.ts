
function isChlorineGasGrenade(itemEntity: ItemEntity_): boolean {
	const customData = itemEntity.item.components.get($DataComponents.CUSTOM_DATA);
	if (customData == null) {
		return false;
	}
	const id = customData.copyTag().getString("id");
	return id === "chlorine_gas_grenade";
}


namespace ChlorineGasGrenadeImpl {

	const despawn = new EntityTimestamp("despawn_timer", 300);
	const chlorineDamageTick = new EntityTimestamp("last_chlorine_damage_tick", 20);

	export function tick(grenade: ItemEntity_): void {
		if (grenade.inWater) {
			playsound(grenade.level, grenade.position(), "minecraft:block.fire.extinguish", "master", 2, 2);
			grenade.kill();
			return;
		}

		if (!grenade.glowing) {
			grenade.setInvulnerable(true);
			grenade.setGlowing(true);
			grenade.setPickUpDelay(2147483647);
		}

		if (grenade.onGround()) {
			whileOnGround(grenade);
		}
	}

	function whileOnGround(grenade: ItemEntity_): void {
		killNearbyChlorineGasGrenades(grenade);
		if (!despawn.has(grenade)) {
			despawn.setAfter(grenade, 1); // so that first tick is 1 instead of 0
		}

		CommandHelper.runCommandSilent(grenade.server,
			`execute in ${grenade.level.dimension.toString()} positioned ${grenade.x} ${grenade.y} ${grenade.z} run `
			+ `particle minecraft:dust{color:[0.55,0.725,0.1],scale:4} ~ ~1.5 ~ 3 1 3 0 10 force @a`
		);

		const diff = despawn.getDiff(grenade)!;
		const level = grenade.level;
		const pos = grenade.position();
		if (diff === 1) {
			playsound(level, pos, "minecraft:block.iron_door.open", "master", 2, 0.5);
		}
		else if (diff === 5) {
			playsound(level, pos, "minecraft:entity.generic.burn", "master", 2, 0.5);
		}
		else if (diff >= 250 && diff <= 290 && diff % 10 === 0) {
			playsound(level, pos, "minecraft:block.fire.extinguish", "master", 2, 2);
		}
		else if (diff >= 300) {
			playsound(level, pos, "minecraft:block.fire.extinguish", "master", 2, 0.5);
			grenade.kill();
		}

		damageNearby(grenade);
	}

	function killNearbyChlorineGasGrenades(grenade: ItemEntity_): void {
		const range = grenade.getBoundingBox().inflate(3, 1, 3);

		const grenades = grenade.level.getEntitiesOfClass<ItemEntity_>($ItemEntity, range, e => e.onGround() && isChlorineGasGrenade(e));
		const oldest = grenades.stream()
			.max($Comparator.comparingInt<ItemEntity_>(e => e.age))
			.orElse(null);

		grenades.stream()
			.filter(e => e !== oldest)
			.forEach(e => e.kill());
	}

	function damageNearby(grenade: ItemEntity_): void {
		const range = grenade.getBoundingBox().inflate(4, 2, 4);

		const entities = grenade.level.getEntitiesOfClass<LivingEntity_>($LivingEntity, range, e => canBeAffectedByChlorine(e));
		for (const victim of entities as LivingEntity_[]) {
			LivingEntityHelper.addEffect(victim, "minecraft:nausea", 200, 0, false, true, true, grenade);
			LivingEntityHelper.addEffect(victim, "minecraft:blindness", 100, 0, false, true, true, grenade);
			LivingEntityHelper.addEffect(victim, "minecraft:slowness", 200, 1, false, true, true, grenade);
			LivingEntityHelper.addEffect(victim, "minecraft:wither", 100, 2, false, true, true, grenade);

			playsound(victim.level, victim.position(), "minecraft:entity.blaze.ambient", "master", 1, 1.75);
			chlorineDamageTick.update(victim);
		}
	}

	function isWearingGasMask(entity: LivingEntity_): boolean {
		const customData = entity.headArmorItem.components.get($DataComponents.CUSTOM_DATA);
		if (customData == null) {
			return false;
		}
		const id = customData.copyTag().getString("id");
		return id === "slimesurvival:gas_mask";
	}

	function canBeAffectedByChlorine(entity: LivingEntity_): boolean {
		if (entity instanceof $ServerPlayer) {
			if (!PlayerHelper.isSurvivalLike(entity)) {
				return false;
			}
			if (isWearingGasMask(entity)) {
				return false;
			}
		}
		return !entity.isInvulnerable() && chlorineDamageTick.hasElapsed(entity);
	}
}