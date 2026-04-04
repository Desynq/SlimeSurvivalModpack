// priority: 1000

namespace MathHelper {
	export function get2dPointInCircle(radius: number) {
		const theta = Math.random() * 2 * Math.PI;
		const r = radius * Math.sqrt(Math.random());
		const x = r * Math.cos(theta);
		const y = r * Math.sin(theta);
		// @ts-ignore
		return x, y;
	}

	export function randInt(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	/**
	 * @param bias higher numbers give a bias towards the minimum
	 */
	export function biasedRandom(min: number, max: number, bias: number) {
		const random = Math.random() ** bias;
		return (max - min) * random + min;
	}



	export function medianBiasedRandom(min: number, max: number, median: number) {
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

	export function distance(vec1: [double, double, double], vec2: [double, double, double]) {
		const dx = vec1[0] - vec2[0];
		const dy = vec1[1] - vec2[1];
		const dz = vec1[2] - vec2[2];
		return Math.sqrt(dx * dx + dy * dy + dz * dz);
	}

	export function clamped(value: number, min: number, max: number) {
		if (value < min) return min;
		if (value > max) return max;
		return value;
	}

	export function lerp(min: number, max: number, factor: number) {
		return min + (max - min) * factor;
	}

	export function slopeIntercept(
		x1: number, y1: number,
		x2: number, y2: number
	): (x: number) => number {
		const m = (y2 - y1) / (x2 - x1);
		const b = y1 - m * x1;
		return (x: number) => m * x + b;
	}

	export function clampedSlopeIntercept(
		x1: number, y1: number,
		x2: number, y2: number,
		yMin = Math.min(y1, y2),
		yMax = Math.max(y1, y2)
	): (x: number) => number {
		const m = (x2 - x1) / (y2 - y1);
		const b = x1 - m * y1;
		return (x: number) => clamped(m * x + b, yMin, yMax);
	}



	export function rationalFalloff(x: number, k: number): number {
		if (k <= 0) throw new Error(`rational falloff cannot have a k < 0. k = ${k}`);

		return 1 / (1 + x / k);
	}



	export function logRamp01(x: number, eps: number): number {
		x = MathHelper.clamped(x, 0, 1);
		if (Math.abs(eps) < 1e-8) return x;

		return Math.log1p(eps * x) / Math.log1p(eps);
	}

	export function expRamp01(x: number, epsilon: number): number {
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