


namespace DeathFatigue.Manager {
	const deathFatigueDataKey = "death_fatigue";
	const ticksPerDeath = 200;
	const maxDeaths = 10;
	const maxFatigue = maxDeaths * ticksPerDeath;

	const maxSlownessAmplifier = 4;
	const maxMiningFatigueAmplifier = 4;

	const minEffectDuration = 100;
	const maxEffectDuration = 600;

	const slowness = MobEffectApplicator.of("minecraft:slowness")
		.withRules(minEffectDuration, maxEffectDuration, 0, 4);

	const weakness = MobEffectApplicator.of("minecraft:weakness")
		.withRules(minEffectDuration, maxEffectDuration, 0, undefined);

	const miningFatigue = MobEffectApplicator.of("minecraft:mining_fatigue")
		.withRules(minEffectDuration, maxEffectDuration, 0, 8);

	const weakKnees = MobEffectApplicator.of("slimesurvival:weak_knees")
		.withRules(minEffectDuration, maxEffectDuration, 0, undefined);

	export function getDeathFatigue(player: ServerPlayer_): integer {
		return player.persistentData.getInt(deathFatigueDataKey);
	}

	function setDeathFatigue(player: ServerPlayer_, ticks: integer): void {
		player.persistentData.putInt(deathFatigueDataKey, ticks);
	}

	export function onDeath(player: ServerPlayer_): void {
		const newFatigue = Math.min(maxFatigue, getDeathFatigue(player) + ticksPerDeath);
		setDeathFatigue(player, newFatigue);
	}

	export function tick(player: ServerPlayer_): void {
		let score = getDeathFatigue(player);
		if (score <= 0) return;

		setDeathFatigue(player, --score);
		if (score === 0) {
			expireEffects(player);
		}
		else {
			const low = ticksPerDeath * 2;
			const high = ticksPerDeath * 5;

			const color = score < low ? "§7" : score < high ? "§8" : "§4";
			const text = `${color}Fatigue: ${TickHelper.toSeconds(player.server, score, 0)}s`;
			ActionbarManager.addMessage(player, text, 1, 0, deathFatigueDataKey);
		}
	}

	export function onRespawn(player: ServerPlayer_): void {
		const fatigue = getDeathFatigue(player);

		const deaths = Math.ceil(fatigue / ticksPerDeath);
		if (deaths === 0) return;

		const amplifier = deaths - 1;
		const duration = Math.min(600, deaths * 100);

		const effects: [string, integer, integer][] = [
			["minecraft:slowness", duration, Math.min(maxSlownessAmplifier, amplifier)],
			["minecraft:weakness", duration, amplifier],
			["minecraft:mining_fatigue", duration, Math.min(maxMiningFatigueAmplifier, amplifier)]
		];
		if (amplifier >= maxSlownessAmplifier) {
			effects.push(["slimesurvival:weak_knees", duration, amplifier - maxSlownessAmplifier - 1]);
		}

		for (const effect of effects) {
			LivingEntityHelper.addEffect(player, effect[0], effect[1], effect[2], false, true, true);
		}
	}

	export function expireEffects(player: ServerPlayer_): void {

	}
}