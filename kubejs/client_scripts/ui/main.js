/**
 * @typedef {import("com.chen1335.renderjs.client.events.renderEvent.RenderJSRenderGuiEvent").$RenderJSRenderGuiEvent$$Original} RenderJSRenderGuiEvent
 */
/** @type {typeof import("com.mojang.math.Axis").$Axis } */
let $Axis = Java.loadClass("com.mojang.math.Axis")

RenderJSEvents.onGuiPostRender(event => {
	const iconOffset = renderRaceIcon(event);
	renderInfo(event, iconOffset);
});



/**
 * 
 * @param {RenderJSRenderGuiEvent} event 
 * @param {integer} iconOffset
 */
function renderInfo(event, iconOffset) {
	const text = `{"color":"dark_green","text":"Balance: "}`
	drawMultiLineString(event, "hello world\ntest", 0 + iconOffset + 4, -4 + iconOffset / 2, 10, 127, 127, 127, 255);
}

function getRaceItem() {
}

/**
 * @param {RenderJSRenderGuiEvent} event 
 */
function renderRaceIcon(event) {
	const x = 0;
	const y = 0;
	const scale = 2;

	const head = Item.playerHead(event.getClient().player.getName().toString());

	const pose = event.poseStack;

	pose.pushPose();

	pose.translate(x, y, 0);

	pose.scale(scale, scale, 1.0);

	event.renderGuiItem(head, x, y);

	pose.popPose();

	const iconSize = 16 * scale;
	return iconSize
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
	const lines = text.split("\n");
	for (let i = 0; i < lines.length; i++) {
		event.drawString(lines[i], x, y + i * lineHeight, r, g, b, a);
	}
}

/**
 * @param {RenderJSRenderGuiEvent} event 
 */
function renderApple(event) {
	const scale = event.window.guiScale;
	const baseSize = 16;
	const iconSize = baseSize * scale;
	const maxX = event.window.guiScaledWidth;
	const maxY = event.window.guiScaledHeight;
	event.drawTexture("minecraft:textures/item/apple.png",
		0,
		0,
		iconSize,
		iconSize
	);
}