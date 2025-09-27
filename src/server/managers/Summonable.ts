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

	public getNode() {
		return $Commands.literal(this.name).executes(context => {
			this.summon(context.source.level, context.source.position);
			return 1;
		});
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
	export const SLIMIFIED_ZOMBIE = Summonable.create("slimified_zombie", "minecraft:zombie", {
		PersistenceRequired: true,
		attributes: [
			{
				id: "minecraft:generic.movement_speed",
				base: 0.3
			}
		],
		CustomName: '{"color":"dark_green","text":"Slimified Zombie"}'
	});
	SLIMIFIED_ZOMBIE.setMaxHealth(40);
}