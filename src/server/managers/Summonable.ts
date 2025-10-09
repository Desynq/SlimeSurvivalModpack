// priority: 1
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
	public static create(name: string, id: string, nbt: Record<string, any>): Summonable {
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
		if (!Array.isArray(this.nbt.attributes)) {
			this.nbt.attributes = [];
		}

		const newEntry = { id: "minecraft:generic.max_health", base: health };

		// look for an existing entry
		const index = this.nbt.attributes.findIndex(
			(attr: any) => attr.id === "minecraft:generic.max_health"
		);

		if (index >= 0) {
			// overwrite existing
			this.nbt.attributes[index] = newEntry;
		} else {
			// add new
			this.nbt.attributes.push(newEntry);
		}

		// also set current health field
		this.nbt.Health = health;

		return this;
	}

	public setBoss(bossId: string): this {
		if (!Array.isArray(this.nbt.tags)) {
			this.nbt.Tags = [];
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
				this.spawn(context.source.level, context.source.position);
				return 1;
			})
			// @ts-ignore
			.then($Commands.argument("amount", $IntegerArgumentType.integer())
				.executes(context => {
					// @ts-ignore
					for (let i = 0; i < $IntegerArgumentType.getInteger(context, "amount"); i++) {
						this.spawn(context.source.level, context.source.position);
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

		const entity = $SummonCommand.createEntity(source, type, position, tag, randomizeProperties);
		// BossDirector.tryAddBoss(entity);
		return entity;
	}
}



namespace Summonables {
	const SLIMIFIED_ARMOR = [
		{},
		{},
		{},
		{
			id: "minecraft:slime_block",
			count: 1
		}
	];
	export const SLIMIFIED_ZOMBIE = Summonable.create("slimified_zombie", "minecraft:zombie", {
		PersistenceRequired: true,
		attributes: [
			{
				id: "minecraft:generic.movement_speed",
				base: 0.3
			}
		],
		ArmorItems: SLIMIFIED_ARMOR,
		ArmorDropChances: [0.0, 0.0, 0.0, 1.0],
		CustomName: '{"color":"dark_green","text":"Slimified Zombie"}'
	});
	SLIMIFIED_ZOMBIE.setMaxHealth(40.0);

	export const SLIMIFIED_SKELETON = Summonable.create("slimified_skeleton", "minecraft:skeleton", {
		PersistenceRequired: true,
		attributes: [
			{
				id: "minecraft:generic.movement_speed",
				base: 0.3
			}
		],
		ArmorItems: SLIMIFIED_ARMOR,
		HandItems: [
			{},
			{
				id: "minecraft:bow",
				count: 1
			}
		],
		CustomName: '{"color":"dark_green","text":"Slimified Skeleton"}'
	});
	SLIMIFIED_SKELETON.setMaxHealth(40.0);

	export const THE_COLOSSUS = Summonable.create("the_colossus", "minecraft:slime", {
		PersistenceRequired: true,
		Size: 10,
		attributes: [
			{
				id: "minecraft:generic.attack_damage",
				base: 0.3
			}
		],
		ArmorItems: SLIMIFIED_ARMOR,
		HandItems: [
			{},
			{
				id: "minecraft:bow",
				count: 1
			}
		],
		CustomName: '{"color":"dark_green","text":"Slimified Skeleton"}'
	});
	SLIMIFIED_SKELETON.setMaxHealth(40.0);

	export const QUEEN_BEE = Summonable.create("queen_bee", "minecraft:bee", {
		PersistenceRequired: true,
		attributes: [
			{
				id: "minecraft:generic.scale",
				base: 3
			}
		],
		CustomName: '{"color":"yellow","text":"The Queen Bee"}'
	})
		.setMaxHealth(1000.0)
		.setBoss("queen_bee");

	export const THE_HUNGER = Summonable.create("the_hunger", "minecraft:rabbit", {
		PersistenceRequired: true,
		attributes: [
			{
				id: "minecraft:generic.attack_damage",
				base: 6
			},
			{
				id: "minecraft:generic.movement_speed",
				base: 0.5
			},
			{
				id: "minecraft:generic.fall_damage_multiplier",
				base: 0.0
			}
		],
		CustomName: '{"color":"dark_red","text":"The Hunger"}',
		RabbitType: 99,
		Glowing: true
	})
		.setMaxHealth(6.0)
		.setBoss("the_hunger");

	export const THE_IMMORTAL = Summonable.create("the_immortal", "rottencreatures:immortal", {
		PersistenceRequired: true,
		attributes: [
			{
				id: "minecraft:generic.attack_damage",
				base: 20
			},
			{
				id: "minecraft:generic.armor",
				base: 20
			}
		],
		CustomName: '{"color":"dark_aqua","text":"The Immortal"}',
		Glowing: true
	})
		.setMaxHealth(10000.00)
		.setBoss("the_immortal");

	export const ZAPPY = Summonable.create("zappy", "rottencreatures:zap", {
		PersistenceRequired: true,
		attributes: [
			{
				id: "minecraft:generic.attack_damage",
				base: 5
			},
			{
				id: "minecraft:generic.armor",
				base: 20
			},
			{
				id: "minecraft:generic.movement_speed",
				base: 0.5
			}
		],
		CustomName: '{"color":"dark_aqua","text":"Zappy"}',
		Glowing: true
	})
		.setMaxHealth(40.00);

	export const TENUEM_BOSS = Summonable.create("tenuem_boss", "minecraft:phantom", {
		PersistenceRequired: true,
		attributes: [
			{
				id: "minecraft:generic.attack_damage",
				base: 100
			},
			{
				id: "minecraft:generic.scale",
				base: 3
			}
		],
		CustomName: '{"color":"dark_aqua","text":"The Tenuem"}',
		Glowing: true
	})
		.setMaxHealth(10_000.00)
		.setBoss("tenuem");

	export const TENUEM_MINION = Summonable.create("tenuem_minion", "minecraft:phantom", {
		PersistenceRequired: true,
		attributes: [
			{
				id: "minecraft:generic.attack_damage",
				base: 8
			}
		],
		CustomName: '{"color":"dark_aqua","text":"Tenuem Minion"}'
	})
		.setMaxHealth(20.00)
		.setCustomEntity("tenuem_minion");
}