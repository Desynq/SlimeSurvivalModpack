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
		const timeLeft = this.cooldown.getMax(player) - this.cooldown.getCurr(player);
		ActionbarManager.addSimple(player, `Focus CD: ${TickHelper.toSeconds(player.server, timeLeft)}s`);
	}

	public updateUI(player: ServerPlayer_): void {
		const max = this.duration.getMax(player);
		const curr = this.duration.getCurr(player);
		ActionbarManager.addSimple(player, `Focus: ${max - curr}`);
	}

	public displayCooldownWarning(player: ServerPlayer_): void {
		const max = this.cooldown.getMax(player);
		const curr = this.cooldown.getCurr(player);
		player.tell(Text.red(`Cannot activate Focus while on cooldown. (${max - curr} ticks left)`));
	}
}