// priority: 0

const PRIMARY_ABILITY_KEY = new KJSKeybind(
	"Primary Ability",
	"key.slimesurvival.primary_ability",
	GLFW.GLFW_KEY_G,
	"key.categories.slimesurvival"
);

const SECONDARY_ABILITY_KEY = new KJSKeybind(
	"Secondary Ability",
	"key.slimesurvival.secondary_ability",
	GLFW.GLFW_KEY_R,
	"key.categories.slimesurvival"
);

const TERTIARY_ABILITY_KEY = new KJSKeybind(
	"Tertiary Ability",
	"key.slimesurvival.tertiary_ability",
	GLFW.GLFW_KEY_H,
	"key.categories.slimesurvival"
);

KeyBindJSEvents.register(event => {
	PRIMARY_ABILITY_KEY.register(event);
	SECONDARY_ABILITY_KEY.register(event);
	TERTIARY_ABILITY_KEY.register(event);
});

ClientEvents.tick(event => {
	[PRIMARY_ABILITY_KEY, SECONDARY_ABILITY_KEY, TERTIARY_ABILITY_KEY].forEach(key => {
		let keyMapping = key.getKeyMapping();
		if (keyMapping.consumeClick()) {
			let payload = new $CompoundTag();
			payload.putString("key", keyMapping.getName());
			Client.player.sendData("KeyPressed", payload);
		}
	});
});