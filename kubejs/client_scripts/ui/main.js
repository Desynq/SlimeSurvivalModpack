"use strict";
/**
 * @typedef {import("com.chen1335.renderjs.client.events.renderEvent.RenderJSRenderGuiEvent").$RenderJSRenderGuiEvent$$Original} RenderJSRenderGuiEvent
 */
/** @type {typeof import("com.mojang.math.Axis").$Axis } */
var $Axis = Java.loadClass("com.mojang.math.Axis");
RenderJSEvents.onGuiPostRender(function (event) {
    var iconOffset = renderRaceIcon(event);
    renderInfo(event, iconOffset);
});
/**
 *
 * @param {RenderJSRenderGuiEvent} event
 * @param {integer} iconOffset
 */
function renderInfo(event, iconOffset) {
    var text = "{\"color\":\"dark_green\",\"text\":\"Balance: \"}";
    drawMultiLineString(event, "hello world\ntest", 0 + iconOffset + 4, -4 + iconOffset / 2, 10, 127, 127, 127, 255);
}
function getRaceItem() {
}
/**
 * @param {RenderJSRenderGuiEvent} event
 */
function renderRaceIcon(event) {
    var x = 0;
    var y = 0;
    var scale = 2;
    var head = Item.playerHead(event.getClient().player.getName().toString());
    var pose = event.poseStack;
    pose.pushPose();
    pose.translate(x, y, 0);
    pose.scale(scale, scale, 1.0);
    event.renderGuiItem(head, x, y);
    pose.popPose();
    var iconSize = 16 * scale;
    return iconSize;
}
/**
 *
 * @param {RenderJSRenderGuiEvent} event
 * @param {string} text
 * @param {integer} x
 * @param {integer} y
 * @param {integer} lineHeight
 * @param {integer} r
 * @param {integer} g
 * @param {integer} b
 * @param {integer} a
 */
function drawMultiLineString(event, text, x, y, lineHeight, r, g, b, a) {
    var lines = text.split("\n");
    for (var i = 0; i < lines.length; i++) {
        event.drawString(lines[i], x, y + i * lineHeight, r, g, b, a);
    }
}
/**
 * @param {RenderJSRenderGuiEvent} event
 */
function renderApple(event) {
    var scale = event.window.guiScale;
    var baseSize = 16;
    var iconSize = baseSize * scale;
    var maxX = event.window.guiScaledWidth;
    var maxY = event.window.guiScaledHeight;
    event.drawTexture("minecraft:textures/item/apple.png", 0, 0, iconSize, iconSize);
}
