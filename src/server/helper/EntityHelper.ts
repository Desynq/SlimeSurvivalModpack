// priority: 999

namespace EntityHelper {
	export function isInDimension(entity: Entity_, dimension: string): boolean {
		return entity.level.dimension.toString() == dimension;
	}

	export function isInOverworld(entity: Entity_): boolean {
		return EntityHelper.isInDimension(entity, "minecraft:overworld");
	}

	export function isInLowOrbit(entity: Entity_): boolean {
		return EntityHelper.isInOverworld(entity) && entity.y >= 200;
	}


	export function isType(entity: Entity_, type: string): boolean {
		return $BuiltInRegistries.ENTITY_TYPE.getKey(entity.getEntityType()).toString() === type;
	}

	/**
	 * This was *mostly* generated from ChatGPT
	 */
	export function teleportRandCircle(entity: Entity_, center: Vec3_, radius: double): void {
		let nX = center.x();
		let nY = center.y();
		let nZ = center.z();

		let found = false;

		for (let i = 0; i < Math.max(1, Math.floor(radius)); i++) {
			const angle = Math.random() * (2 * Math.PI);
			const dist = Math.sqrt(Math.random()) * radius;

			const testX = center.x() + Math.cos(angle) * dist;
			const testZ = center.z() + Math.sin(angle) * dist;
			const targetY = center.y();

			const targetPos = new $Vec3(testX, targetY, testZ);
			const aabb = entity.getBoundingBox().move(
				targetPos.x() - entity.x,
				targetPos.y() - entity.y,
				targetPos.z() - entity.z
			);

			if (entity.level.noBlockCollision(entity, aabb as any)) {
				nX = Math.floor(testX) + 0.5;
				nY = Math.floor(targetY);
				nZ = Math.floor(testZ) + 0.5;
				found = true;
				break;
			}
		}

		if (!found) {
			const angle = Math.random() * (2 * Math.PI);
			const dist = Math.sqrt(Math.random()) * radius;
			const testX = center.x() + Math.cos(angle) * dist;
			const testZ = center.z() + Math.sin(angle) * dist;

			nX = Math.floor(testX) + 0.5;
			nZ = Math.floor(testZ) + 0.5;

			const surfaceY = entity.level.getHeight("motion_blocking_no_leaves", nX, nZ);
			nY = Math.floor(surfaceY + 1.0);
		}

		entity.teleportTo(nX, nY, nZ);
	}

	/**
	 * This was entirely generated from ChatGPT
	 */
	export function teleportRandDonut(entity: Entity_, center: Vec3_, innerRadius: double, outerRadius: double): void {
		let nX = center.x();
		let nY = center.y();
		let nZ = center.z();

		let found = false;

		for (let i = 0; i < Math.max(1, Math.floor(outerRadius)); i++) {
			const angle = Math.random() * (2 * Math.PI);

			// pick distance so that points are evenly distributed in area between inner and outer
			const dist = Math.sqrt(
				Math.random() * (outerRadius * outerRadius - innerRadius * innerRadius) +
				innerRadius * innerRadius
			);

			const testX = center.x() + Math.cos(angle) * dist;
			const testZ = center.z() + Math.sin(angle) * dist;
			const targetY = center.y();

			const targetPos = new $Vec3(testX, targetY, testZ);
			const aabb = entity.getBoundingBox().move(
				targetPos.x() - entity.x,
				targetPos.y() - entity.y,
				targetPos.z() - entity.z
			);

			if (entity.level.noBlockCollision(entity, aabb as any)) {
				nX = Math.floor(testX) + 0.5;
				nY = Math.floor(targetY);
				nZ = Math.floor(testZ) + 0.5;
				found = true;
				break;
			}
		}

		if (!found) {
			const angle = Math.random() * (2 * Math.PI);
			const dist = Math.sqrt(
				Math.random() * (outerRadius * outerRadius - innerRadius * innerRadius) +
				innerRadius * innerRadius
			);

			const testX = center.x() + Math.cos(angle) * dist;
			const testZ = center.z() + Math.sin(angle) * dist;

			nX = Math.floor(testX) + 0.5;
			nZ = Math.floor(testZ) + 0.5;

			const surfaceY = entity.level.getHeight("motion_blocking_no_leaves", Math.floor(nX), Math.floor(nZ));
			nY = Math.floor(surfaceY + 1);
		}

		entity.teleportTo(nX, nY, nZ);
	}

	export function getNearbySurvivors(entity: Entity_, range: double): ServerPlayer_[] {
		const aabb = entity.boundingBox.inflate(range);
		return entity.level.getEntitiesOfClass(
			$ServerPlayer as any,
			aabb as any,
			(player: ServerPlayer_) => PlayerHelper.isSurvivalLike(player)
		).toArray();
	}



	export function isEntityInFOV(sourceEntity: Entity_, entity: Entity_, fov: number = 90): boolean {
		const sourcePos = sourceEntity.eyePosition;
		const entityPos = entity.eyePosition;

		const lookVec = sourceEntity.getLookAngle();

		const toEntity = entityPos.subtract(sourcePos as any).normalize();

		const dot = lookVec.dot(toEntity as any);

		const halfFov = fov / 2;
		const threshold = Math.cos((halfFov * Math.PI) / 180.0);

		if (dot < threshold) return false; // outside angular cone

		const context = new $ClipContext(
			sourcePos as any,
			entityPos as any,
			"collider",
			"none",
			sourceEntity
		);
		const hit = sourceEntity.level.clip(context);

		return hit.getType() === $HitResult$Type.MISS;
	}
}