// priority: 1


class FixedSpawnTable extends SpawnTable {

	private readonly defaultEntry: SpawnEntry | undefined;
	private readonly entries: SpawnEntry[];

	public constructor(
		defaultEntry?: SpawnEntry,
		entries: SpawnEntry[] = []
	) {
		super();
		this.defaultEntry = defaultEntry;
		this.entries = entries;
	}

	public override getEntries(event: CheckLivingEntitySpawnKubeEvent_): SpawnEntry[] {
		return this.entries;
	}

	public override getDefaultEntry(event: CheckLivingEntitySpawnKubeEvent_): SpawnEntry | undefined {
		return this.defaultEntry;
	}


	public static Builder = class FixedSpawnTableBuilder {

		private defaultEntry: SpawnEntry | undefined;
		private readonly entries: SpawnEntry[] = [];

		public addRawEntry(entry: SpawnEntry): this {
			this.entries.push(entry);
			return this;
		}

		public addEntry(id: string, chance: Percent): this {
			const summonable = new Summonable(id, id, {});
			const entry = new FixedSpawnEntry(summonable, chance);
			this.addRawEntry(entry);
			return this;
		}

		public addCappedEntry(id: string, chance: Percent, cap: integer, distance: double = 128.0, tag: string = id): this {
			tag = tag.replace(":", ".");
			const nbt = {
				Tags: [
					tag
				]
			};

			const summonable = new Summonable(id, id, nbt);
			const entry = new CappedSpawnEntry(summonable, chance, distance, tag, cap);
			this.addRawEntry(entry);
			return this;
		}

		public addDespawnableEntry(id: string, chance: Percent): this {
			const summonable = new Summonable(id, id, { Tags: ["despawnable"] });
			const entry = new FixedSpawnEntry(summonable, chance);
			this.addRawEntry(entry);
			return this;
		}

		public setDefaultEntry(entry: SpawnEntry): this {
			this.defaultEntry = entry;
			return this;
		}

		public build(): FixedSpawnTable {
			return new FixedSpawnTable(this.defaultEntry, this.entries);
		}
	};
}