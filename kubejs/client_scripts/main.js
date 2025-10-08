"use strict";
ClientEvents.tick(function (event) {
    JumpKeyPress();
    CrawlKeyPress();
});
var wasJumpDown = false;
function JumpKeyPress() {
    var isJumpDown = $Minecraft.instance.options.keyJump.down;
    if (isJumpDown && !wasJumpDown) {
        var payload = new $CompoundTag();
        payload.putString("key", "jump");
        Client.player.sendData("KeyPressed", payload);
    }
    wasJumpDown = isJumpDown;
}
var wasCrawlDown = false;
function CrawlKeyPress() {
    /** @type {import("net.minecraft.client.KeyMapping").$KeyMapping$$Original} */
    var key = $CrawlClient.key;
    var isCrawlDown = key.down;
    if (isCrawlDown && !wasCrawlDown) {
        var payload = new $CompoundTag();
        payload.putString("key", "crawl");
        Client.player.sendData("KeyPressed", payload);
    }
    wasCrawlDown = isCrawlDown;
}
