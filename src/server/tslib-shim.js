// priority: 100000

const __setFunctionName = function(f, name, prefix) {
	try {
		f._displayName = prefix ? `${prefix} ${name}` : name;
	} catch (e) {
		// ignore Rhino restrictions
	}
	return f;
};

const __spreadArray = function(to, from, pack) {
	// Ignore pack, Rhino doesn't need the fancy sparse-array handling
	for (var i = 0, l = from.length; i < l; i++) {
		to[to.length] = from[i];
	}
	return to;
};