





ClientEvents.tick(event => {
	JumpKeyPress();
	CrawlKeyPress();
});

let wasJumpDown = false;
function JumpKeyPress() {
	const isJumpDown = $Minecraft.instance.options.keyJump.down;

	if (isJumpDown && !wasJumpDown) {
		const payload = new $CompoundTag();
		payload.putString("key", "jump");
		Client.player.sendData("KeyPressed", payload);
	}

	wasJumpDown = isJumpDown;
}


let wasCrawlDown = false;
function CrawlKeyPress() {
	/** @type {import("net.minecraft.client.KeyMapping").$KeyMapping$$Original} */
	const key = $CrawlClient.key;
	const isCrawlDown = key.down;

	if (isCrawlDown && !wasCrawlDown) {
		const payload = new $CompoundTag();
		payload.putString("key", "crawl");
		Client.player.sendData("KeyPressed", payload);
	}

	wasCrawlDown = isCrawlDown;
}