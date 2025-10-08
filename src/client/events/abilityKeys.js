// priority: 0

/** @type {typeof import("net.neoforged.neoforge.common.util.Lazy").$Lazy} */
let $Lazy = Java.loadClass("net.neoforged.neoforge.common.util.Lazy");

/** @type {typeof import("net.neoforged.neoforge.client.event.RegisterKeyMappingsEvent").$RegisterKeyMappingsEvent} */
let $RegisterKeyMappingsEvent = Java.loadClass("net.neoforged.neoforge.client.event.RegisterKeyMappingsEvent");

const PRIMARY_ABILITY_KEY = $Lazy.of(() => new $KeyMapping(
	"key.slimesurvival.primary_ability",
	$InputConstants$Type.KEYSYM,
	GLFW.GLFW_KEY_Q,
	"key.categories.slimesurvival"
));
const SECONDARY_ABILITY_KEY = $Lazy.of(() => new $KeyMapping(
	"key.slimesurvival.secondary_ability",
	$InputConstants$Type.KEYSYM,
	GLFW.GLFW_KEY_E,
	"key.categories.slimesurvival"
));
const TERTIARY_ABILITY_KEY = $Lazy.of(() => new $KeyMapping(
	"key.slimesurvival.tertiary_ability",
	$InputConstants$Type.KEYSYM,
	GLFW.GLFW_KEY_R,
	"key.categories.slimesurvival"
));

const KEYS = [PRIMARY_ABILITY_KEY, SECONDARY_ABILITY_KEY, TERTIARY_ABILITY_KEY];

NativeEvents.onEvent($RegisterKeyMappingsEvent, event => {
	KEYS.forEach(key => event.register(key.get()));
});

ClientEvents.tick(event => {
	KEYS.map(key => key.get()).forEach(key => {
		if (key.consumeClick()) {
			let payload = new $CompoundTag();
			payload.putString("key", key.getName());
			Client.player.sendData("KeyPressed", payload);
		}
	});
});