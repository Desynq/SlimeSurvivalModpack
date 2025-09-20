
const PRIMARY_ABILITY_KEY = new KJSKeybind(
	"Primary Ability",
	"key.slimesurvival.primary_ability",
	GLFW.GLFW_KEY_G,
	"key.categories.slimesurvival"
);

ClientEvents.tick(event => {
	const keyMapping = PRIMARY_ABILITY_KEY.getKeyMapping();
	if (!keyMapping.consumeClick()) {
		return;
	}

	const payload = new $CompoundTag();
	payload.putString("key", keyMapping.getName());
	Client.player.sendData("KeyPressed", payload);
});

KeyBindJSEvents.register(event => {
	PRIMARY_ABILITY_KEY.register(event);
});