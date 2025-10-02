// ignored: true

class TickRateArea {
	public constructor(
		public readonly id: string,
		public readonly tickRate: integer,
		public readonly aabb: AABB_,
		public readonly ownerUUID: string,
		public readonly dimension: string
	) { }

	public getOwner(server: MinecraftServer_): Entity_ | null {
		return server.getEntityByUUID(this.ownerUUID);
	}

	public get namespace(): string {
		return this.id.substring(0, this.id.indexOf(":"));
	}

	public get path(): string {
		return this.id.substring(this.id.indexOf(":") + 1);
	}

	public isQuantumRelativity(): boolean {
		return this.namespace === "farlander.quantum_relativity";
	}

	public isWithin(dimension: string, position: Vec3_): boolean {
		return this.dimension === dimension && this.aabb.contains(position as any);
	}

	public isActive(server: MinecraftServer_): boolean {
		return this.getOwner(server) != null;
	}
}

class TickRateManager {

	public static serializeTickRateArea(server: MinecraftServer_, area: TickRateArea) {
		const tag = server.persistentData.getCompound("tick_rate_areas");
		const subtag = new $CompoundTag();
		subtag.putInt("tick_rate", area.tickRate);
		subtag.putString("owner_uuid", area.ownerUUID);
		subtag.putString("dimension", area.dimension);
		subtag.putDouble("min_x", area.aabb.minX);
		subtag.putDouble("min_y", area.aabb.minY);
		subtag.putDouble("min_z", area.aabb.minZ);
		subtag.putDouble("max_x", area.aabb.maxX);
		subtag.putDouble("max_y", area.aabb.maxY);
		subtag.putDouble("max_z", area.aabb.maxZ);
		tag.put(area.id, subtag);
		server.persistentData.put("tick_rate_areas", tag);
	}

	public static deserializeTickRateArea(server: MinecraftServer_, id: string): TickRateArea {
		const tag = server.persistentData.getCompound("tick_rate_areas");
		if (tag.isEmpty()) throw new Error(`persistent data tick_rate_areas does hold a reference for ${id}`);

		const subtag = tag.getCompound(id);
		if (subtag.isEmpty()) throw new Error(`persistent data tick_rate_areas does hold a reference for ${id}`);

		return new TickRateArea(
			id,
			subtag.getInt("tick_rate"),
			new $AABB(
				subtag.getDouble("min_x"),
				subtag.getDouble("min_y"),
				subtag.getDouble("min_z"),
				subtag.getDouble("max_x"),
				subtag.getDouble("max_y"),
				subtag.getDouble("max_z")
			),
			subtag.getString("owner_uuid"),
			subtag.getString("dimension")
		);
	}

	private static getTickRateAreas(server: MinecraftServer_): TickRateArea[] {
		const tag = server.persistentData.getCompound("tick_rate_areas");
		return tag.getAllKeys()
			.stream()
			.map(key => this.deserializeTickRateArea(server, key))
			.toArray();
	}

	public static removeTickRateArea(server: MinecraftServer_, id: string) {
		const tag = server.persistentData.getCompound("tick_rate_areas");
		tag.remove(id);
	}

	public static getTickRate(entity: Entity_): integer {
		const server = entity.server;

		const areas = this.getTickRateAreas(server).filter(area =>
			area.isActive(server)
			&& area.isWithin(entity.level.dimension.toString(), entity.position())
		);
		if (areas.length === 0) return TickHelper.getDefaultTickRate(server);

		const rates = areas.map(area => area.tickRate);
		return Math.min(...rates);
	}

	static {
		NativeEvents.onEvent($EntityTickEvent$Pre, event => {
			const entity = event.getEntity();
			const tickRate = TickRateManager.getTickRate(entity);
			if ($TickrateUtil["hasTimer(net.minecraft.world.entity.Entity)"](entity)) {
				if ($TickrateUtil["getTimer(net.minecraft.world.entity.Entity)"](entity).tickrate === tickRate) return;
			}

			if (tickRate === TickHelper.getDefaultTickRate(entity.server)) {
				$TickrateUtil.resetTickrate(entity);
			}
			else {
				$TickrateUtil.setTickrate(entity, tickRate);
			}
		});
	}
}