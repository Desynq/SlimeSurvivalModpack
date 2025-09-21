

// this shit is so close to Java it's beautiful
class QuantumRelativityAbility {
	public static ToggleController = class {
		private static readonly KEY = "farlander.quantum_relativity.toggle";

		public static isToggled(player: ServerPlayer): boolean {
			return player.persistentData.getBoolean(this.KEY);
		}

		public static toggle(player: ServerPlayer): void {
			player.persistentData.putBoolean(this.KEY, !this.isToggled(player));
		}
	};

	public static CooldownController = class {
		private static readonly KEY = "farlander.quantum_relativity.cooldown";

		public static getMax(player: ServerPlayer): integer {
			return 100;
		}

		public static hasPassed(player: ServerPlayer): boolean {
			return TickHelper.hasTimestampPassed(player, this.KEY, this.getMax(player));
		}

		public static getCurr(player: ServerPlayer): integer {
			return TickHelper.getTimestampDiff(player, this.KEY);
		}

		public static update(player: ServerPlayer): void {
			TickHelper.forceUpdateTimestamp(player, this.KEY);
		}

		public static reset(player: ServerPlayer): void {
			TickHelper.resetTimestamp(player, this.KEY);
		}
	};

	public static DurationController = class {
		private static readonly KEY: string = "farlander.quantum_relativity.duration";

		public static getMax(player: ServerPlayer): number {
			return 200;
		}

		public static hasPassed(player: ServerPlayer): boolean {
			return TickHelper.hasTimestampPassed(player, this.KEY, this.getMax(player));
		}

		public static getCurr(player: ServerPlayer): number {
			return TickHelper.getTimestampDiff(player, this.KEY);
		}

		public static update(player: ServerPlayer): void {
			TickHelper.forceUpdateTimestamp(player, this.KEY);
		}
	};
}