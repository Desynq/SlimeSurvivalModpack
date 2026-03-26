


namespace AdventureHandler {

	class CylindricalZone {

		public constructor(
			private readonly dimension: string,
			private readonly cx: long,
			private readonly cz: long,
			private readonly radius: integer,
			private readonly minY?: long,
			private readonly maxY?: long
		) { }

		public isIn(entity: Entity_): boolean {
			return entity.level.dimension.toString() === this.dimension
				&& EntityHelper.isInVoxelCylinder(entity, this.cx, this.cz, this.radius, this.minY, this.maxY);
		}

		public save(): CompoundTag_ {
			const tag = new $CompoundTag();

			tag.putString("type", "cylinder");
			tag.putLong("cx", this.cx);
			tag.putLong("cz", this.cz);
			tag.putInt("radius", this.radius);
			if (this.minY !== undefined) tag.putLong("minY", this.minY);
			if (this.maxY !== undefined) tag.putLong("maxY", this.maxY);

			return tag;
		}

		public static load(server: MinecraftServer_, dimension: string, tag: CompoundTag_): CylindricalZone | null {
			const type = tag.getString("type");
			if (type !== "cylinder") return null;

			const obj = {
				cx: NBTHelper.getOrNull<long>(tag, "cx", $Tag.TAG_LONG),
				cz: NBTHelper.getOrNull<long>(tag, "cz", $Tag.TAG_LONG),
				radius: NBTHelper.getOrNull<integer>(tag, "radius", $Tag.TAG_INT),
				minY: NBTHelper.getOrNull<long>(tag, "minY", $Tag.TAG_LONG) ?? undefined,
				maxY: NBTHelper.getOrNull<long>(tag, "maxY", $Tag.TAG_LONG) ?? undefined,
			};

			if (!hasNoNull(obj)) {
				return null;
			}

			return new CylindricalZone(
				dimension,
				obj.cx,
				obj.cz,
				obj.radius,
				obj.minY,
				obj.maxY
			);
		}
	}

	class ZoneManager {
		private readonly zones: CylindricalZone[] = [];

		public constructor(server: MinecraftServer_) {
			const zonesTag = NBTHelper.getOrCreateCompound(server.persistentData, "adventure_zones");

			for (const dimension of zonesTag.allKeys.toArray() as string[]) {
				const list = NBTHelper.getOrNull<ListTag_>(zonesTag, dimension, $Tag.TAG_LIST);
				if (list === null) {
					zonesTag.remove(dimension);
					continue;
				}

				const arr = list.toArray();
				for (let i = 0; i < arr.length; i++) {
					const tag = arr[i];
					if (!(tag instanceof $CompoundTag)) {
						list.remove(i);
						continue;
					}

					const zone = CylindricalZone.load(server, dimension, tag);
					if (zone === null) {
						list.remove(i);
						continue;
					}

					this.zones.push(zone);
				}
			}
		}
	}

	let zoneManager: ZoneManager | null = null;

	ServerEvents.tick(event => {
		const server = event.server;

		if (zoneManager === null) {
			zoneManager = new ZoneManager(server);
		}

		for (const player of server.players as ServerPlayer_[]) {
			const hasAdventureEffect = LivingEntityHelper.hasEffect(player, "slimesurvival:adventure");

			if (hasAdventureEffect && PlayerHelper.isSurvival(player)) {
				player.setGameMode("adventure");
			}
			else if (!hasAdventureEffect && PlayerHelper.isAdventure(player)) {
				player.setGameMode("survival");
			}
		}
	});
}