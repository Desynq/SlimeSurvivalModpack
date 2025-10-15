
const BoltActionRifle = new (class {
	public readonly COOLDOWN = 40;
	private readonly cooldownTs = new EntityTimestamp<ServerPlayer_>("bolt_action_rifle_cooldown");
	private readonly lastHeldTs = new EntityTimestamp<ServerPlayer_>("bolt_action_rifle_last_held");

	public isCorrectGun(weapon: ItemStack_): boolean {
		const customData = weapon.components.get($DataComponents.CUSTOM_DATA as any) as CustomData_;
		if (customData == null) {
			return false;
		}
		const id = customData.copyTag().getString("id");
		return id === "bolt_action_rifle";
	};

	public whileHeld(shooter: ServerPlayer_, weapon: ItemStack_): void {
		if (this.cooldownTs.has(shooter)) {
			const diff = this.lastHeldTs.getDiff(shooter);
			if (diff === undefined || diff > 1) {
				this.setCooldown(shooter);
			}

			this.handleCooldown(shooter, weapon);
		}
		this.lastHeldTs.update(shooter);
	}

	private handleCooldown(shooter: ServerPlayer_, weapon: ItemStack_): void {
		const remaining = this.cooldownTs.getRemaining(shooter, this.COOLDOWN);
		if (remaining === undefined) return;

		switch (remaining) {
			case Math.floor(this.COOLDOWN * (3 / 4)):
				playsound(shooter.level, shooter.position(), "block.iron_door.open", "master", 1, 0.5);
				break;
			case Math.floor(this.COOLDOWN * (1 / 3)):
				playsound(shooter.level, shooter.position(), "item.crossbow.loading_end", "master", 1, 1.0);
				break;
			case 0:
				playsound(shooter.level, shooter.position(), "block.iron_door.close", "master", 1, 0.5);
				this.removeCooldown(shooter);
				break;
		}
	}

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
		const ammoCount = shooter.inventory.countItem("minecraft:iron_nugget");
		return ammoCount > 0;
	}

	public onCooldown(shooter: ServerPlayer_): boolean {
		return !this.cooldownTs.hasElapsed(shooter, this.COOLDOWN);
	}

	public setCooldown(shooter: ServerPlayer_): void {
		this.cooldownTs.update(shooter);
	}

	public removeCooldown(shooter: ServerPlayer_): void {
		this.cooldownTs.remove(shooter);
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
		const arrowStack = new $ItemStack("minecraft:arrow");
		const arrowItem = $Items.ARROW as import("net.minecraft.world.item.ArrowItem").$ArrowItem$$Original;

		const arrow = arrowItem.createArrow(shooter.level as any, arrowStack as any, shooter, weapon as any);

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

PlayerEvents.tick(event => {
	const player = event.player as ServerPlayer_;
	if (BoltActionRifle.isCorrectGun(player.mainHandItem)) {
		BoltActionRifle.whileHeld(player, player.mainHandItem);
	}
});