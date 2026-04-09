

namespace Sculker.Rootfall {

	interface Settings {
		graceTicks: number;
		maxFallDist: number;
	}

	class RootfallTracker {
		private prevOnGround = false;
		private graceTicksRemaining = 0;

		public constructor(
			private readonly uuid: string
		) { }

		public isActive(player: ServerPlayer_): boolean {
			if (player.stringUUID !== this.uuid) throw new Error();
			return this.graceTicksRemaining > 0;
		}

		public tick(player: ServerPlayer_, settings: Settings): void {
			if (player.stringUUID !== this.uuid) throw new Error();

			const onGround = player.onGround();
			const vy = player.deltaMovement.y();

			const leftGround = this.prevOnGround && !onGround;

			if (leftGround) {
				const jumped = vy > 0.1;

				if (jumped) {
					this.cancel(player);
				}
				else {
					this.startGraceWindow(player, settings.graceTicks);
				}
			}

			if (this.graceTicksRemaining > 0) {
				this.graceTicksRemaining--;

				if (player.fallDistance > settings.maxFallDist) {
					this.cancel(player);
				}
			}

			if (onGround) {
				this.graceTicksRemaining = 0;
			}

			this.prevOnGround = onGround;
		}

		public startGraceWindow(player: ServerPlayer_, graceTicks: number): void {
			if (player.stringUUID !== this.uuid) throw new Error();
			this.graceTicksRemaining = graceTicks;
		}

		public cancel(player: ServerPlayer_): void {
			if (player.stringUUID !== this.uuid) throw new Error();
			this.graceTicksRemaining = 0;
		}
	}

	const rootfalls = new UUIDRegistry<RootfallTracker>(uuid => new RootfallTracker(uuid));

	export function tick(player: ServerPlayer_): void {
		const settings = getSettings(player);
		rootfalls.getOrCreate(player.stringUUID).tick(player, settings);
	}

	function getSettings(player: ServerPlayer_): Settings {
		const settings: Settings = {
			graceTicks: 0,
			maxFallDist: 0
		};

		SculkerSkills.ROOTFALL.ifUnlocked(player, skill => {
			settings.graceTicks += skill.data.graceTicks;
			settings.maxFallDist += skill.data.maxFallDist;
		});

		return settings;
	}

	export function isActive(player: ServerPlayer_): boolean {
		return rootfalls.getOrCreate(player.stringUUID).isActive(player);
	}

	export function isActiveOrOnGround(player: ServerPlayer_): boolean {
		const bl = isActive(player) || player.onGround();
		return bl;
	}
}