


namespace AdventureHandler {

	interface AdventureZone {
		isIn(entity: Entity_): boolean;
	}

	class DimensionZone implements AdventureZone {
		public constructor(
			private readonly dimension: string
		) { }

		public isIn(entity: Entity_): boolean {
			return entity.level.dimension.toString() === this.dimension;
		}
	}

	class CylindricalZone implements AdventureZone {

		public constructor(
			public readonly dimension: string,
			public readonly cx: long,
			public readonly cz: long,
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

		public equalsTag(tag: unknown): boolean {
			if (!(tag instanceof $CompoundTag)) return false;

			if (NBTHelper.getStringOrNull(tag, "type") !== "cylinder") return false;
			if (NBTHelper.getLongOrNull(tag, "cx") !== this.cx) return false;
			if (NBTHelper.getLongOrNull(tag, "cz") !== this.cz) return false;
			if (NBTHelper.getLongOrNull(tag, "radius") !== this.radius) return false;
			if (NBTHelper.getLongOrNull(tag, "minY") ?? undefined !== this.minY) return false;
			if (NBTHelper.getLongOrNull(tag, "maxY") ?? undefined !== this.maxY) return false;

			return true;
		}

		public static load(server: MinecraftServer_, dimension: string, tag: CompoundTag_): CylindricalZone | null {
			const type = tag.getString("type");
			if (type !== "cylinder") return null;

			const obj = {
				cx: NBTHelper.getLongOrNull(tag, "cx"),
				cz: NBTHelper.getLongOrNull(tag, "cz"),
				radius: NBTHelper.getIntOrNull(tag, "radius"),
				minY: NBTHelper.getLongOrNull(tag, "minY") ?? undefined,
				maxY: NBTHelper.getLongOrNull(tag, "maxY") ?? undefined,
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
		private readonly zones: AdventureZone[] = [];

		public constructor(
			private readonly server: MinecraftServer_
		) {
			this.refresh();
		}

		public refresh(): void {
			this.zones.length = 0;
			this.loadZonesFromData();
			this.addDimZone("slimesurvival:deadzone");
		}

		private getZonesTag(): CompoundTag_ {
			return NBTHelper.getOrCreateCompound(this.server.persistentData, "adventure_zones");
		}

		private getZonesList(dimension: string): ListTag_ | null {
			return NBTHelper.getListOrNull(this.getZonesTag(), dimension);
		}

		private createZonesList(dimension: string): ListTag_ {
			return NBTHelper.getOrCreateTagList(this.getZonesTag(), dimension);
		}

		private loadZonesFromData(): void {
			const zonesTag = this.getZonesTag();

			for (const dimension of zonesTag.allKeys.toArray() as string[]) {
				const list = this.getZonesList(dimension);
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

					const zone = this.loadZoneFromData(dimension, tag);
					if (zone === null) {
						list.remove(i);
						continue;
					}

					this.zones.push(zone);
				}
			}
		}

		private loadZoneFromData(dimension: string, tag: CompoundTag_): AdventureZone | null {
			let zone: AdventureZone | null;
			zone = CylindricalZone.load(this.server, dimension, tag);
			if (zone === null) {
				return null;
			}

			return zone;
		}

		public addDimZone(dimension: string): void {
			const zone = new DimensionZone(dimension);
			this.zones.push(zone);
		}

		public addCylZone(dimension: string, cx: long, cz: long, radius: integer, minY?: long, maxY?: long): void {
			const zone = new CylindricalZone(dimension, cx, cz, radius, minY, maxY);
			const tag = zone.save();
			const listTag = this.createZonesList(zone.dimension);
			listTag.addLast(tag as any);

			this.zones.push(zone);
		}

		/**
		 * Remove all cylindrical zones with the specified cx and cz
		 */
		public removeCylZone(cx: number, cz: number): void {
			ArrayHelper.filterInPlace(this.zones, (zone, i) => {
				if (zone instanceof CylindricalZone) {
					if (zone.cx === cx && zone.cz === cz) {
						const list = this.getZonesList(zone.dimension);
						list?.removeIf(tag => !zone.equalsTag(tag));
						return false;
					}
				}
				return true;
			});
		}



		public isInZone(entity: Entity_): boolean {
			for (const zone of this.zones) {
				const inZone = zone.isIn(entity);
				if (inZone) return true;
			}

			return false;
		}
	}


	const adventureEffect = MobEffectApplicator.of("slimesurvival:adventure")
		.withDuration(19)
		.withVisibility(false, true);

	let _zoneManager: ZoneManager | null = null;

	export function getZoneManager(server: MinecraftServer_): ZoneManager {
		return _zoneManager ??= new ZoneManager(server);
	}

	ServerEvents.tick(event => {
		const server = event.server;

		const zoneManager = getZoneManager(server);

		for (const player of server.players as ServerPlayer_[]) {
			if (zoneManager.isInZone(player)) {
				adventureEffect.apply(player);
			}

			const hasAdventureEffect = adventureEffect.has(player);

			if (hasAdventureEffect && PlayerHelper.isSurvival(player)) {
				player.setGameMode("adventure");
			}
			else if (!hasAdventureEffect && PlayerHelper.isAdventure(player)) {
				player.setGameMode("survival");
			}
		}
	});
}