// priority: 2

class FocusAbilityUI implements IToggleableAbilityUI {
	public constructor(
		private readonly cooldown: TimestampController,
		private readonly duration: TimestampController
	) { }

	public abilityEnabled(player: ServerPlayer_): void {
		playsoundAll(player.server, "minecraft:block.beacon.activate", "player", 2, 2);
	}

	public abilityDisabled(player: ServerPlayer_): void {
		playsoundAll(player.server, "minecraft:entity.zombie_villager.converted", "ambient", 2, 2);
	}

	public alertCooldownOver(player: ServerPlayer_): void {
		playsound(player.level, player.position(), "minecraft:block.beacon.power_select", "player", 2, 2);
	}

	public alertChargeOver(player: ServerPlayer_): void {
		playsound(player.level, player.position(), "minecraft:item.trident.return", "player", 2, 0.5);
	}

	public displayCooldown(player: ServerPlayer_): void {
		const ticksLeft = this.cooldown.getMax(player) - this.cooldown.getCurr(player);
		const seconds = TickHelper.toSeconds(player.server, ticksLeft, 0);
		ActionbarManager.addSimple(player, `Focus CD: ${seconds}s`);
	}

	public updateUI(player: ServerPlayer_): void {
		const max = this.duration.getMax(player);
		const curr = this.duration.getCurr(player);
		const charging = FocusAbility.isCharging(player);
		const text = `{"text":"Focus: ${max - curr}","color":"${charging ? "dark_gray" : "yellow"}"}`;
		ActionbarManager.addMessage(player, text, 1);
	}

	public displayCooldownWarning(player: ServerPlayer_): void {
		const max = this.cooldown.getMax(player);
		const curr = this.cooldown.getCurr(player);
		player.tell(Text.red(`Cannot activate Focus while on cooldown. (${max - curr} ticks left)`));
	}
}