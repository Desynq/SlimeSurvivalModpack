// priority: 1

/**
 * 
 * @param {string} name 
 * @param {string} keyNameKey 
 * @param {integer} keyCode 
 * @param {string} keyGroupKey 
 */
function KJSKeybind(name, keyNameKey, keyCode, keyGroupKey) {
	this.name = name;
	this.keyNameKey = keyNameKey;
	this.keyCode = keyCode;
	this.keyGroupKey = keyGroupKey;

	this.keyMapping = new $KeyMapping(
		this.keyNameKey,
		this.keyCode,
		this.keyGroupKey
	);
}

/**
 * @param {import("com.common.keybindjs.kubejs.KeyBindEvent").$KeyBindEvent$$Original} event 
 */
KJSKeybind.prototype.register = function(event) {
	event.create(this.name, this.keyNameKey, this.keyCode, this.keyGroupKey);
}

KJSKeybind.prototype.getKeyMapping = function() {
	return this.keyMapping;
}