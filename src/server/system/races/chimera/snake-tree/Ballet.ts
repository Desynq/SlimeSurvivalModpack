

namespace Chimera.BalletSkill {

	function wrapDegrees(deg: float): float {
		deg = (deg + 180) % 360;
		if (deg < 0) deg += 360;
		return deg - 180;
	}

	function angleDeltaSigned(from: float, to: float): float {
		return wrapDegrees(to - from);
	}

	const DELTA_ROTATION_TAG_KEY = "chimera.ballet_skill.delta_rotation";

	export function hasDeltaRotation(player: ServerPlayer_): boolean {
		return player.persistentData.contains(DELTA_ROTATION_TAG_KEY, $Tag.TAG_FLOAT);
	}

	export function getDeltaRotation(player: ServerPlayer_): float {
		return player.persistentData.getFloat(DELTA_ROTATION_TAG_KEY);
	}

	function setDeltaRotation(player: ServerPlayer_, delta: float): void {
		player.persistentData.putFloat(DELTA_ROTATION_TAG_KEY, delta);
	}

	export function resetDeltaRotation(player: ServerPlayer_): void {
		player.persistentData.remove(DELTA_ROTATION_TAG_KEY);
		completedRotationTimestamp.remove(player);
	}

	export function addDeltaRotation(player: ServerPlayer_, delta: float): void {
		if (delta === 0) return;

		const prevDelta = getDeltaRotation(player);

		const jitterThreshold = 1.5;
		// seed a new delta if player meaningfully changes spin direction
		if (hasChangedDirection(prevDelta, delta) && !hasRotationProtected(player)) {
			if (hasCompletedRotation(player)) {
				PlaysoundHelper.playsoundAheadSelf(player, "entity.blaze.death", "player", 1, 2);
			}
			resetDeltaRotation(player);
			setDeltaRotation(player, delta);
		}
		else {
			setDeltaRotation(player, prevDelta + delta);
		}
	}

	function hasChangedDirection(prevDelta: float, delta: float): boolean {
		const jitterThreshold = 1.5;

		const changedDirection = prevDelta !== 0 && Math.sign(prevDelta) !== Math.sign(delta);
		const notJitter = Math.abs(delta) > jitterThreshold;

		return changedDirection && notJitter;
	}

	function hasRotationProtected(player: ServerPlayer_): boolean {
		return hasCompletedRotation(player) && ChimeraSkills.GEARSHIFT.isUnlockedFor(player);
	}


	function getDeltaRotationNeeded(player: ServerPlayer_): float {
		return 360;
	}

	const completedRotationTimestamp = new EntityTimestamp("chimera.ballet_skill.completed_rotation_timestamp", 1);

	export function hasJustCompletedRotation(player: ServerPlayer_): boolean {
		const diff = completedRotationTimestamp.getDiff(player);
		if (diff !== undefined) {
			if (diff === 0) return true;
			if (diff > 0) return false;
		}

		const absDeltaRot = Math.abs(getDeltaRotation(player));
		if (absDeltaRot < getDeltaRotationNeeded(player)) return false;

		completedRotationTimestamp.update(player);
		return true;
	}

	export function hasCompletedRotation(player: ServerPlayer_): boolean {
		return completedRotationTimestamp.getDiff(player) !== undefined;
	}


	const prevYawDataKey = "chimera.ballet_skill.prev_yaw";

	export function updatePrevYaw(player: ServerPlayer_): void {
		player.persistentData.putFloat(prevYawDataKey, player.yaw);
	}

	export function getDeltaYaw(player: ServerPlayer_): float {
		const data = player.persistentData;
		const currYaw = player.yaw;
		const prevYaw = data.contains(prevYawDataKey, $Tag.TAG_FLOAT)
			? data.getFloat(prevYawDataKey)
			: currYaw;

		const deltaYaw = angleDeltaSigned(prevYaw, currYaw);
		return deltaYaw;
	}


	export function startDeltaRotation(player: ServerPlayer_): void {
		setDeltaRotation(player, 0);
		completedRotationTimestamp.remove(player); // in case timestamp didn't clear after last shot
	}

	const successfulShotTimestamp = new EntityTimestamp("chimera.ballet_skill.successful_shot_timestamp", 1);

	export function tryProcBallet(player: ServerPlayer_): void {
		if (!hasDeltaRotation(player)) return; // ballet never started

		if (hasCompletedRotation(player)) {
			successfulShotTimestamp.update(player);
			resetDeltaRotation(player);
		}
	}

	export function isBalletActive(player: ServerPlayer_): boolean {
		return successfulShotTimestamp.getDiff(player) === 0;
	}
}