
const MathHelper = {};

/**
 * 
 * @param {number} radius 
 */
MathHelper.get2dPointInCircle = function(radius) {
	const theta = Math.random() * 2 * Math.PI;
	const r = radius * Math.sqrt(Math.random());
	const x = r * Math.cos(theta);
	const y = r * Math.sin(theta);
	// @ts-ignore
	return x, y;
}



/**
 * @param {number} min 
 * @param {number} max 
 * @param {number} bias higher numbers give a bias towards the minimum
 */
MathHelper.biasedRandom = function(min, max, bias) {
	const random = Math.random() ** bias;
	return (max - min) * random + min;
}



MathHelper.medianBiasedRandom = function(min, max, median) {
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

/**
 * 
 * @param {[double, double, double]} vec1 
 * @param {[double, double, double]} vec2 
 */
MathHelper.distance = function(vec1, vec2) {
	const dx = vec1[0] - vec2[0];
	const dy = vec1[1] - vec2[1];
	const dz = vec1[2] - vec2[2];
	return Math.sqrt(dx * dx + dy * dy + dz * dz);
}