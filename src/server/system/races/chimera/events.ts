

namespace Chimera.Events {

	EntityEvents.spawned(event => {
		const entity = event.entity;
		if (!(entity instanceof $AbstractArrow)) return;

		const owner = entity.owner;
		if (owner instanceof $ServerPlayer) {
			shotArrow(owner, entity);
		}
	});


	NativeEvents.onEvent($LivingEntityUseItemEvent$Stop, event => {
		const player = event.entity;
		if (!(player instanceof $ServerPlayer)) return;

		const stack = event.item;
		if (stack.id.toString() !== "minecraft:bow") return;

		const duration = player.getTicksUsingItem();
		if (ChimeraSkills.PIERCE.isUnlockedFor(player) && duration >= PierceSkill.getDurationNeeded(player)) {
			PierceSkill.procPierce(player);
		}

		BalletSkill.tryProcBallet(player);
	});

	NativeEvents.onEvent($LivingEntityUseItemEvent$Start, event => {
		const player = event.entity;
		if (!(player instanceof $ServerPlayer)) return;

		const stack = event.item;
		if (stack.id.toString() !== "minecraft:bow") return;

		if (ChimeraSkills.BALLET.isUnlockedFor(player)) {
			BalletSkill.startDeltaRotation(player);
		}
	});

	PlayerEvents.tick(event => {
		const player = event.player as ServerPlayer_;

		const useStack = player.getUseItem() as ItemStack_ | null;
		if (!useStack || useStack.id.toString() !== "minecraft:bow") return;

		const duration = player.getTicksUsingItem();
		tickDrawingBow(player, useStack, duration);
	});


	NativeEvents.onEvent("normal", $DamageAfterArmorEvent, event => {
		const immediate = event.source.immediate as Entity_ | null;
		if (!(immediate instanceof $AbstractArrow)) return;

		if (!PierceSkill.hasPierce(immediate)) return;

		const afterArmorDamage = event.getFinalDamage();
		const beforeArmorDamage = event.getOriginalDamage();
		if (afterArmorDamage >= beforeArmorDamage) return;

		const restorationModifier = 0.5;
		const restoredDamage = (beforeArmorDamage - afterArmorDamage) * restorationModifier;
		const finalDamage = afterArmorDamage + restoredDamage;

		const owner = immediate.owner;
		if (owner instanceof $ServerPlayer) {
			const text = `${beforeArmorDamage.toFixed(2)} -> ${afterArmorDamage.toFixed(2)} -> ${finalDamage.toFixed(2)}`;
			ActionbarManager.addMessage(owner, text, 40);
		}

		event.setFinalDamage(finalDamage);
	});

	function shotArrow(owner: ServerPlayer_, arrow: AbstractArrow_): void {
		if (ChimeraSkills.TOXOPHILITE.isUnlockedFor(owner)) {
			ToxophiliteSkill.applyBoost(owner, arrow);
		}

		if (PierceSkill.isPierceActive(owner)) {
			PierceSkill.setPierce(arrow);
		}

		if (BalletSkill.isBalletActive(owner)) {
			arrow.baseDamage *= 2;
		}
	}

	function tickDrawingBow(player: ServerPlayer_, bow: ItemStack_, duration: integer): void {
		if (ChimeraSkills.PIERCE.isUnlockedFor(player) && duration === PierceSkill.getDurationNeeded(player)) {
			PierceSkill.notifyPierceReady(player);
		}

		if (BalletSkill.hasDeltaRotation(player)) {
			const deltaYaw = BalletSkill.getDeltaYaw(player);
			BalletSkill.addDeltaRotation(player, deltaYaw);

			if (BalletSkill.hasJustCompletedRotation(player)) {
				PlaysoundHelper.playsoundAhead(player, "entity.arrow.hit_player", "player", 1, 0.6);
			}

			BalletSkill.updatePrevYaw(player);
		}
	}
}