let $CompoundTag = Java.loadClass("net.minecraft.nbt.CompoundTag");
let $Minecraft = Java.loadClass("net.minecraft.client.Minecraft");
let $ScreenEvent$KeyPressed$Pre = Java.loadClass("net.neoforged.neoforge.client.event.ScreenEvent$KeyPressed$Pre");


let wasJumpDown = false;

ClientEvents.tick(event => {
	const isJumpDown = $Minecraft.instance.options.keyJump.down;
	let justPressedJumpDown = false;

	if (isJumpDown && !wasJumpDown) {
		// Jump key was just pressed
		justPressedJumpDown = true;
		const payload = new $CompoundTag();
		payload.putString("key", "jump");
		Client.player.sendData("KeyPressed", payload);
	}

	wasJumpDown = isJumpDown;
});