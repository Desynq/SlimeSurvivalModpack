let $CompoundTag = Java.loadClass("net.minecraft.nbt.CompoundTag");
let $Minecraft = Java.loadClass("net.minecraft.client.Minecraft");
let $ScreenEvent$KeyPressed$Pre = Java.loadClass("net.neoforged.neoforge.client.event.ScreenEvent$KeyPressed$Pre");

let $CrawlClient = Java.loadClass("ru.fewizz.crawl.client.CrawlClient")



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
	/** @type {$KeyMapping_} */
	const key = $CrawlClient.key;
	const isCrawlDown = key.down;

	if (isCrawlDown && !wasCrawlDown) {
		const payload = new $CompoundTag();
		payload.putString("key", "crawl");
		Client.player.sendData("KeyPressed", payload);
	}

	wasCrawlDown = isCrawlDown;
}