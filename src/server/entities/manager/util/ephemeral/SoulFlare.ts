// priority: 2

/**
 * Deterministic linear projectile. Origin and target are immutable
 */
class SoulFlare {

	/**
	 * @returns `undefined` if origin and target occupy the exact same position
	 */
	public static spawn(origin: Entity_, target: Entity_, distance: number, stepSize: double): SoulFlare {
		const ox = origin.x;
		const oy = origin.y + origin.eyeHeight * 0.5;
		const oz = origin.z;

		const px = target.x;
		const py = target.y + target.eyeHeight * 0.5;
		const pz = target.z;

		// Direction vector from boss to player
		let dx = px - ox;
		let dy = py - oy;
		let dz = pz - oz;

		// Normalize direction
		let length = Math.sqrt(dx * dx + dy * dy + dz * dz);
		if (length === 0) { // fallback to shooting in a random direction if the target is exactly inside of the origin
			const theta = Math.random() * 2 * Math.PI;
			const phi = Math.acos(2 * Math.random() - 1);
			dx = Math.sin(phi) * Math.cos(theta);
			dy = Math.cos(phi);
			dz = Math.sin(phi) * Math.sin(theta);
			length = 1;
		}

		dx /= length;
		dy /= length;
		dz /= length;

		const targetX = ox + dx * distance;
		const targetY = oy + dy * distance;
		const targetZ = oz + dz * distance;

		return new SoulFlare(ox, oy, oz, targetX, targetY, targetZ, stepSize);
	}

	private readonly ox: double;
	private readonly oy: double;
	private readonly oz: double;
	public readonly distance: double;
	private arrived: boolean = false;
	private moves: integer = 0;
	private age: integer = 0;

	private constructor(
		private x: double,
		private y: double,
		private z: double,
		private readonly x2: double,
		private readonly y2: double,
		private readonly z2: double,
		public readonly stepSize: double,
	) {
		this.ox = x;
		this.oy = y;
		this.oz = z;

		const dx = this.x2 - this.ox;
		const dy = this.y2 - this.oy;
		const dz = this.z2 - this.oz;

		this.distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
	}

	public tick(level: ServerLevel_): void {
		this.age++;
		this.move(level);
	}

	private getTicksNeeded(): double {
		return this.distance / this.stepSize;
	}

	public hasElapsed(extraTicks: integer): boolean {
		return this.age >= this.getTicksNeeded() + extraTicks;
	}

	private move(level: ServerLevel_): void {
		if (this.arrived) return;

		const dx = this.x2 - this.x;
		const dy = this.y2 - this.y;
		const dz = this.z2 - this.z;

		const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
		if (dist < 1e-6) {
			this.onArrive(level);
			return;
		}
		this.moves++;

		const scale = Math.min(this.stepSize / dist, 1);
		this.x += dx * scale;
		this.y += dy * scale;
		this.z += dz * scale;

		if (dist <= this.stepSize) {
			this.onArrive(level);
		}
	}

	/**
	 * @returns Players hit by soul flare including players in creative/spectator or already dead
	 */
	public playerCollisionCheck(level: ServerLevel_, distance: double): ServerPlayer_[] {
		const flareAABB = new $AABB(this.x - distance, this.y - distance, this.z - distance,
			this.x + distance, this.y + distance, this.z + distance
		);

		const players: ServerPlayer_[] = [];
		for (const player of level.players.toArray() as ServerPlayer_[]) {
			if (player.boundingBox.intersects(flareAABB as any)) {
				players.push(player);
			}
		}
		return players;
	}

	public playerLineCollisionCheck(level: ServerLevel_, range: double, lingerTicks: double): ServerPlayer_[] {
		const players: ServerPlayer_[] = [];

		// Determine how far back to consider for the “active” segment
		const backDistance = this.stepSize * lingerTicks;

		// Vector from origin to current
		const totalDx = this.x - this.ox;
		const totalDy = this.y - this.oy;
		const totalDz = this.z - this.oz;

		const totalDist = Math.sqrt(totalDx * totalDx + totalDy * totalDy + totalDz * totalDz);
		if (totalDist < 1e-6) return players; // hasn't moved yet

		// Clamp relevance distance so we don't go before the origin
		const segLen = Math.min(backDistance, totalDist);

		// Find the start point of the relevant segment
		const startX = this.x - (totalDx / totalDist) * segLen;
		const startY = this.y - (totalDy / totalDist) * segLen;
		const startZ = this.z - (totalDz / totalDist) * segLen;

		for (const player of level.players.toArray() as ServerPlayer_[]) {
			if (this.lineIntersectsAABB(startX, startY, startZ, this.x, this.y, this.z, player.boundingBox)) {
				players.push(player);
			}
		}
		return players;
	}

	private lineIntersectsAABB(ax: number, ay: number, az: number,
		bx: number, by: number, bz: number,
		aabb: AABB_
	): boolean {
		let tmin = 0;
		let tmax = 1;
		const dirX = bx - ax;
		const dirY = by - ay;
		const dirZ = bz - az;

		// helper
		const checkAxis = (start: number, dir: number, min: number, max: number) => {
			if (Math.abs(dir) < 1e-8) {
				if (start < min || start > max) return false;
			}
			else {
				const ood = 1 / dir;
				let t1 = (min - start) * ood;
				let t2 = (max - start) * ood;
				if (t1 > t2) [t1, t2] = [t2, t1];
				tmin = Math.max(tmin, t1);
				tmax = Math.min(tmax, t2);
				if (tmin > tmax) return false;
			}
			return true;
		};

		if (!checkAxis(ax, dirX, aabb.minX, aabb.maxX)) return false;
		if (!checkAxis(ay, dirY, aabb.minY, aabb.maxY)) return false;
		if (!checkAxis(az, dirZ, aabb.minZ, aabb.maxZ)) return false;
		return true;
	}

	private distancePointToSegment(px: number, py: number, pz: number,
		ax: number, ay: number, az: number,
		bx: number, by: number, bz: number
	): number {
		const abx = bx - ax;
		const aby = by - ay;
		const abz = bz - az;
		const apx = px - ax;
		const apy = py - ay;
		const apz = pz - az;

		const abLenSq = abx * abx + aby * aby + abz * abz;
		if (abLenSq === 0) return Math.sqrt(apx * apx + apy * apy + apz * apz); // a and b are same point

		// Project point p onto line ab, clamp to segment
		let t = (apx * abx + apy * aby + apz * abz) / abLenSq;
		t = MathHelper.clamped(t, 0, 1);

		const closestX = ax + abx * t;
		const closestY = ay + aby * t;
		const closestZ = az + abz * t;

		const dx = px - closestX;
		const dy = py - closestY;
		const dz = pz - closestZ;

		return Math.sqrt(dx * dx + dy * dy + dz * dz);
	}

	public hasArrived(): boolean {
		return this.arrived;
	}

	public getMoves(): integer {
		return this.moves;
	}

	public getPos(): [double, double, double] {
		return [this.x, this.y, this.z];
	}

	protected onArrive(level: ServerLevel_): void {
		this.arrived = true;
	}
}