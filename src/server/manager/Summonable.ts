// priority: 2

class SummonableRegistry {
	private static readonly all: Summonable[] = [];

	public static add(instance: Summonable): void {
		this.all.push(instance);
	}

	public static getAll(): Summonable[] {
		return this.all;
	}

	public static forEach(fn: (s: Summonable) => void) {
		this.all.forEach(fn);
	}
}

class Summonable {
	public static create(name: string, id: string, nbt: Record<string, any> = {}): Summonable {
		const instance = new this(name, id, { ...nbt }); // shallow clone of nbt
		SummonableRegistry.add(instance);
		return instance;
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

	public getNode() {
		return $Commands.literal(this.name)
			.executes(context => {
				this.spawn(context.source.level as ServerLevel_, context.source.position);
				return 1;
			})
			// @ts-ignore
			.then($Commands.argument("amount", $IntegerArgumentType.integer())
				.executes(context => {
					// @ts-ignore
					for (let i = 0; i < $IntegerArgumentType.getInteger(context, "amount"); i++) {
						this.spawn(context.source.level as ServerLevel_, context.source.position);
					}
					return 1;
				})
			);
	}

	public spawn(level: ServerLevel_, position: Vec3_, randomizeProperties: boolean = false): Entity_ {
		const rk = $ResourceKey.create($Registries.ENTITY_TYPE, this.id);
		const type = level.registryAccess().registryOrThrow($Registries.ENTITY_TYPE).getHolderOrThrow(rk);
		const source = level.getServer().createCommandSourceStack().withLevel(level);
		const tag: CompoundTag_ = $TagParser.parseTag(JSON.stringify(this.nbt));

		const entity = $SummonCommand.createEntity(source, type, position as any, tag, randomizeProperties);
		return entity;
	}
}