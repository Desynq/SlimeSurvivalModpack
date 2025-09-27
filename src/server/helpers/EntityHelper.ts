


namespace EntityHelper {
	export function isInDimension(entity: Entity, dimension: string): boolean {
		return entity.level.dimension.toString() == dimension;
	}

	export function isInOverworld(entity: Entity): boolean {
		return EntityHelper.isInDimension(entity, "minecraft:overworld");
	}

	export function isInLowOrbit(entity: Entity): boolean {
		return EntityHelper.isInOverworld(entity) && entity.y >= 200;
	}


	export function isType(entity: Entity, type: string): boolean {
		return $BuiltInRegistries.ENTITY_TYPE.getKey(entity.getEntityType()).toString() === type;
	}
}