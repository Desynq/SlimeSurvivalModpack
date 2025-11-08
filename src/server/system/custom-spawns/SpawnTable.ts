// priority: 2

abstract class SpawnTable {

	protected abstract getEntries(event: CheckLivingEntitySpawnKubeEvent_): SpawnEntry[];

	protected abstract getDefaultEntry(event: CheckLivingEntitySpawnKubeEvent_): SpawnEntry | undefined;

	public roll(event: CheckLivingEntitySpawnKubeEvent_): Summonable | undefined {
		const entries = this.getEntries(event);
		const chances = entries.map(entry => entry.getChance(event));
		const total = Math.max(1.0, chances.reduce((acc, chance) => acc + chance, 0));

		let roll = Math.random() * total;

		for (let i = 0; i < entries.length; i++) {
			roll -= chances[i];
			if (roll <= 0) return entries[i].getSummonable(event);
		}

		return this.getDefaultEntry(event)?.getSummonable(event);
	}
}