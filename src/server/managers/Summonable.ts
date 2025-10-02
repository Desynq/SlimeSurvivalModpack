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

	public getNode() {
		return $Commands.literal(this.name)
			.executes(context => {
				this.summon(context.source.level, context.source.position);
				return 1;
			})
			// @ts-ignore
			.then($Commands.argument("amount", $IntegerArgumentType.integer())
				.executes(context => {
					// @ts-ignore
					for (let i = 0; i < $IntegerArgumentType.getInteger(context, "amount"); i++) {
						this.summon(context.source.level, context.source.position);
					}
					return 1;
				})
			);
	}

	public summon(
		level: ServerLevel_,
		position: Vec3_
	): this {
		CommandHelper.runCommandSilent(
			level.server,
			`execute in ${level.dimension.toString()} run summon ${this.id} ${position.x()} ${position.y()} ${position.z()} ${JSON.stringify(this.nbt)}`,
			false
		);
		return this;
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
}