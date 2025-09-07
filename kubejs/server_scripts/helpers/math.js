/**
 * @param {number} min 
 * @param {number} max 
 * @param {number} bias higher numbers give a bias towards the minimum
 */
function biasedRandom(min, max, bias) {
	const random = Math.random() ** bias;
	return (max - min) * random + min;
}



const MathHelper = {};

/**
 * 
 * @param {number} radius 
 */
MathHelper.get2dPointInCircle = function (radius) {
	const theta = Math.random() * 2 * Math.PI;
	const r = radius * Math.sqrt(Math.random());
	const x = r * Math.cos(theta);
	const y = r * Math.sin(theta);
	return x, y;
}