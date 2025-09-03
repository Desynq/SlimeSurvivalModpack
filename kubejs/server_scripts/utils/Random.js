const Random = {};

Random.nextInt = function (min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}