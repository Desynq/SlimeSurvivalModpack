// priority: 1000

const __setFunctionName = function(f, name, prefix) {
	try {
		f._displayName = prefix ? `${prefix} ${name}` : name;
	} catch (e) {
		// ignore Rhino restrictions
	}
	return f;
};