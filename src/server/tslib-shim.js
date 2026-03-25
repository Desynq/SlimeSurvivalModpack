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

var __values = function(o) {
	if (o == null)
		throw new TypeError("Object is null.");

	// Java Iterable (KubeJS collections)
	if (typeof o.iterator === "function") {
		var jIt = o.iterator();
		return {
			next: function() {
				if (jIt.hasNext())
					return { value: jIt.next(), done: false };
				return { value: undefined, done: true };
			},
			return: function() {
				return { done: true };
			}
		};
	}

	// ES iterator
	if (typeof Symbol === "function" && o[Symbol.iterator]) {
		var iter = o[Symbol.iterator]();

		if (typeof iter.next !== "function")
			throw new TypeError("Iterator missing next()");

		if (typeof iter.return !== "function") {
			iter.return = function() {
				return { done: true };
			};
		}

		return iter;
	}

	// Real arrays only
	if (Array.isArray(o)) {
		var i = 0;

		return {
			next: function() {
				if (i >= o.length)
					return { value: undefined, done: true };

				return {
					value: o[i++],
					done: false
				};
			},
			return: function() {
				return { done: true };
			}
		};
	}

	throw new TypeError("Object is not iterable.");
};