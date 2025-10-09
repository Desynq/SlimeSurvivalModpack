

class ParticleHelper {

	public static spawnCircle(level: ServerLevel_, x: double, y: double, z: double, radius: double, points: integer, particle: string, speed: double, override: boolean): void {
		for (let i = 0; i < points; i++) {
			const angle = 2 * Math.PI * i / points;
			const px = x + radius * Math.cos(angle);
			const pz = z + radius * Math.sin(angle);

			level.spawnParticles(particle, override, px, y, pz, 0, 0, 0, 1, speed);
		}
	}

	public static drawLine(
		level: ServerLevel_,
		x: double, y: double, z: double,
		x2: double, y2: double, z2: double,
		points: integer,
		particle: string,
		speed: double,
		override: boolean
	): void {
		if (points <= 0) return;

		if (points === 1) {
			// single midpoint
			const mx = (x + x2) / 2;
			const my = (y + y2) / 2;
			const mz = (z + z2) / 2;
			level.spawnParticles(particle, override, mx, my, mz, 0, 0, 0, 1, speed);
			return;
		}

		// multiple evenly spaced points (including start and end)
		for (let i = 0; i < points; i++) {
			const t = i / (points - 1); // goes 0 -> 1
			const px = x + (x2 - x) * t;
			const py = y + (y2 - y) * t;
			const pz = z + (z2 - z) * t;

			level.spawnParticles(particle, override, px, py, pz, 0, 0, 0, 1, speed);
		}
	}

	public static drawLineVec(level: ServerLevel_, pos1: Vec3_, pos2: Vec3_, points: integer, particle: string, speed: double, override: boolean): void {
		this.drawLine(level, pos1.x(), pos1.y(), pos1.z(), pos2.x(), pos2.y(), pos2.z(), points, particle, speed, override);
	}
}