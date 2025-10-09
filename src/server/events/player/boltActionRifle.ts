
const BoltActionRifle = new (class {
	public readonly COOLDOWN = 20;

	public isCorrectGun(weapon: ItemStack_): boolean {
		const customData = weapon.components.get($DataComponents.CUSTOM_DATA);
		if (customData == null) {
			return false;
		}
		const id = customData.copyTag().getString("id");
		return id === "bolt_action_rifle";
	};

	public tryFire(shooter: ServerPlayer_, weapon: ItemStack_): void {
		if (!this.canFire(shooter, weapon)) return;

		this.fire(shooter, weapon);
	};

	public canFire(shooter: ServerPlayer_, weapon: ItemStack_): boolean {
		if (!this.isCorrectGun(weapon)) return false;

		if (!shooter.hasInfiniteMaterials() && !this.hasAmmo(shooter)) return false;

		if (this.onCooldown(shooter)) return false;

		return true;
	}

	public hasAmmo(shooter: ServerPlayer_): boolean {
		const ammoItem = $BuiltInRegistries.ITEM.get("minecraft:iron_nugget");
		const ammoCount = shooter.inventory.countItem(ammoItem);
		return ammoCount > 0;
	}

	public onCooldown(shooter: ServerPlayer_): boolean {
		return !TickHelper.hasTimestampElapsed(shooter, "bolt_action_rifle_fire_cooldown", this.COOLDOWN);
	}

	public setCooldown(shooter: ServerPlayer_): void {
		TickHelper.forceUpdateTimestamp(shooter, "bolt_action_rifle_fire_cooldown");
	}



	private consumeAmmo(shooter: ServerPlayer_): void {
		if (!shooter.hasInfiniteMaterials()) {
			shooter.server.runCommandSilent(`clear ${shooter.username} minecraft:iron_nugget 1`);
		}
	}

	private fire(shooter: ServerPlayer_, weapon: ItemStack_) {
		this.consumeAmmo(shooter);

		playsound(shooter.level, shooter.position(), "minecraft:entity.firework_rocket.large_blast", "master", 16, 1);
		this.summonProjectile(shooter, weapon);
		this.setCooldown(shooter);
	};

	private summonProjectile(shooter: ServerPlayer_, weapon: ItemStack_): void {
		const arrowStack = new $ItemStack($Items.ARROW);
		const arrowItem = $Items.ARROW as import("net.minecraft.world.item.ArrowItem").$ArrowItem$$Original;

		const arrow = arrowItem.createArrow(shooter.level, arrowStack as any, shooter, weapon as any);

		const tag = new $CompoundTag();
		arrow.saveWithoutId(tag);

		tag.putByte("pickup", 2);
		tag.putByte("PierceLevel", 10);
		tag.putDouble("damage", 3);

		arrow.load(tag);

		const spread = this.getAimSpread(shooter, weapon);
		shooter.tell(spread.toString());
		arrow.shootFromRotation(shooter, shooter.xRot, shooter.yRot, 0, 20, spread);

		shooter.level.addFreshEntity(arrow as any);
	}

	private getAimSpread(shooter: ServerPlayer_, weapon: ItemStack_): double {
		if (QuantumRelativity.isActive(shooter) && FarlanderSkills.THE_WORLD.isUnlockedFor(shooter)) {
			return 0;
		}
		const speed = Velocity.get(shooter);
		let spread = speed * 45;
		return spread;
	}
})();



NativeEvents.onEvent($PlayerInteractEvent$RightClickItem, event => {
	const stack = event.getItemStack();
	const player = event.getEntity();
	if (!(player instanceof $ServerPlayer)) return;

	BoltActionRifle.tryFire(player, stack);
});