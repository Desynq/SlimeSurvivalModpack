// priority: 2

class SummonableBuilder {

	public static create(name: string, id: string, nbt: Record<string, any> = {}): SummonableBuilder {
		const builder = new this(name, id, { ...nbt }); // shallow clone of nbt
		return builder;
	}

	private constructor(
		private readonly name: string,
		private readonly id: string,
		private readonly nbt: Record<string, any>
	) { }

	public setMaxHealth(health: number): this {
		this.addAttribute("minecraft:generic.max_health", health);

		// also set current health field
		this.nbt.Health = health;

		return this;
	}

	public addAttribute(id: string, base: double): this {
		if (!Array.isArray(this.nbt.attributes)) {
			this.nbt.attributes = [];
		}

		const newEntry = { id, base };

		// look for an existing entry
		const index = this.nbt.attributes.findIndex(
			(attr: any) => attr.id === id
		);

		if (index >= 0) {
			// overwrite existing
			this.nbt.attributes[index] = newEntry;
		}
		else {
			// add new
			this.nbt.attributes.push(newEntry);
		}

		return this;
	}

	public setHandItems(mainhand?: string, offhand?: string): this {
		const handItems: ({ id: string; count: integer; } | {})[] = [];
		if (mainhand !== undefined) {
			handItems.push({ id: mainhand, count: 1 });
		}
		else {
			handItems.push({});
		}

		if (offhand !== undefined) {
			handItems.push({ id: offhand, count: 1 });
		}
		else {
			handItems.push({});
		}

		this.nbt.HandItems = handItems;

		return this;
	}

	public setArmorItems(feet?: string, legs?: string, chest?: string, head?: string): this {
		const armorItems: ({ id: string; count: integer; } | {})[] = [];

		for (const piece of [feet, legs, chest, head]) {
			if (piece === undefined) {
				armorItems.push({});
			}
			else {
				armorItems.push({ id: piece, count: 1 });
			}
		}

		this.nbt.ArmorItems = armorItems;

		return this;
	}

	public setBoss(bossId?: string): this {
		if (!Array.isArray(this.nbt.tags)) {
			this.nbt.Tags = [];
		}

		if (bossId === undefined) {
			bossId = this.name;
		}
		this.nbt.Tags.push(`boss.${bossId}`);

		return this;
	}

	public setCustomEntity(entityId: string): this {
		if (!Array.isArray(this.nbt.tags)) {
			this.nbt.Tags = [];
		}

		this.nbt.Tags.push(`entity.${entityId}`);

		return this;
	}



	/**
	 * Returns a built `Summonable` and registers it so that it can be spawned with `/admin summon`
	 */
	public register(): Summonable {
		const summonable = this.build();
		SummonableRegistry.add(summonable);
		return summonable;
	}

	public build(): Summonable {
		return new Summonable(this.name, this.id, this.nbt);
	}
}