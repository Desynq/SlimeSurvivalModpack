// priority: 1000

class MathHelper {
	public static get2dPointInCircle(radius: number) {
		const theta = Math.random() * 2 * Math.PI;
		const r = radius * Math.sqrt(Math.random());
		const x = r * Math.cos(theta);
		const y = r * Math.sin(theta);
		// @ts-ignore
		return x, y;
	}

	public static randInt(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	/**
	 * @param bias higher numbers give a bias towards the minimum
	 */
	public static biasedRandom(min: number, max: number, bias: number) {
		const random = Math.random() ** bias;
		return (max - min) * random + min;
	}



	public static medianBiasedRandom(min: number, max: number, median: number) {
		if (median <= min || median >= max) {
			throw new Error("median must be strictly between min and max");
		}

		if (Math.random() < 0.5) {
			return min + Math.random() * (median - min);
		}
		else {
			return median + Math.random() * (max - median);
		}
	}

	public static distance(vec1: [double, double, double], vec2: [double, double, double]) {
		const dx = vec1[0] - vec2[0];
		const dy = vec1[1] - vec2[1];
		const dz = vec1[2] - vec2[2];
		return Math.sqrt(dx * dx + dy * dy + dz * dz);
	}

	public static clamped(value: number, min: number, max: number) {
		if (value < min) return min;
		if (value > max) return max;
		return value;
	}

	public static lerp(min: number, max: number, factor: number) {
		return min + (max - min) * factor;
	}

	public static slopeIntercept(
		x1: number, y1: number,
		x2: number, y2: number
	): (x: number) => number {
		const m = (y2 - y1) / (x2 - x1);
		const b = y1 - m * x1;
		return (x: number) => m * x + b;
	}

	public static clampedSlopeIntercept(
		x1: number, y1: number,
		x2: number, y2: number,
		yMin = Math.min(y1, y2),
		yMax = Math.max(y1, y2)
	): (x: number) => number {
		const m = (x2 - x1) / (y2 - y1);
		const b = x1 - m * y1;
		return (x: number) => this.clamped(m * x + b, yMin, yMax);
	}



	public static logRamp01(x: number, eps: number): number {
		x = MathHelper.clamped(x, 0, 1);
		if (Math.abs(eps) < 1e-8) return x;

		return Math.log1p(eps * x) / Math.log1p(eps);
	}

	public static expRamp01(x: number, epsilon: number): number {
		x = MathHelper.clamped(x, 0, 1);
		if (Math.abs(epsilon) < 1e-8) {
			return x;
		}
		else if (epsilon > 0) {
			const base = 1 + epsilon;
			const exp = base ** x;
			return (exp - 1) / epsilon;
		}
		else {
			epsilon = -epsilon;
			const base = 1 + epsilon;
			const exp = base ** (1 - x);
			return 1 - (exp - 1) / epsilon;
		}
	}
}