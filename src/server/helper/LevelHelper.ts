// priority: 1000

namespace LevelHelper {


	export function getEntities<T extends LivingEntity_>(
		level: ServerLevel_,
		pos: Vec3_,
		distance: double,
		clazz: new (...args: any[]) => T,
		cond: (entity: LivingEntity_) => boolean
	): T[] {
		const aabb = $AABB.ofSize(pos as any, distance, distance, distance);

		const entities = level.getNearbyEntities(
			clazz as any,
			$TargetingConditions.forNonCombat().selector(entity => cond(entity)),
			null as any,
			aabb as any
		).toArray() as T[];

		return entities;
	}

	export function countEntities<T extends Entity_>(
		level: ServerLevel_,
		pos: Vec3_,
		distance: double,
		clazz: new (...args: any[]) => T,
		cond: (entity: T) => boolean,
		limit: integer = Number.MAX_SAFE_INTEGER
	): long {
		const aabb = new $AABB(
			pos.x() - distance, pos.y() - distance, pos.z() - distance,
			pos.x() + distance, pos.y() + distance, pos.z() + distance
		);
		const list = level.getEntitiesOfClass(clazz as any, aabb as any);
		let count = 0;
		for (let i = 0; i < list.size(); i++) {
			const entity = list.get(i) as any;
			if (cond(entity)) {
				count++;
				if (count >= limit) break; // early exit once cap reached
			}
		}
		return count;
	}


	export function setPDGamerule(level: ServerLevel_, id: string, value: boolean | integer | "clear!"): void {
		const dimension = level.dimension.toString();
		const command = `execute in ${dimension} run pdgamerule ${id} ${value}`;
		level.runCommandSilent(command);
	}
}