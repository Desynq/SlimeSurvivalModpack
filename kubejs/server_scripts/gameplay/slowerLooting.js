/** @type {typeof import("net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$RightClickBlock").$PlayerInteractEvent$RightClickBlock} */
let $PlayerInteractEvent$RightClickBlock = Java.loadClass("net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$RightClickBlock");




/** @type {Object.<string, Array<integer>} */
const timesRightClickedMap = {};

BlockEvents.rightClicked("minecraft:trapped_chest", event => {
	const player = event.player;
	const block = event.block;
	const uuid = player.uuid.toString();

	if (timesRightClickedMap[uuid] == null) {
		timesRightClickedMap[uuid] = [uuid, block.x, block.y, block.z, 0];
	}
	const data = timesRightClickedMap[uuid];

	if (data[1] == block.x && data[2] == block.y && data[3] == block.z) {
		data[4]++;
	}
	else {
		data[1] = block.x;
		data[2] = block.y;
		data[3] = block.z;
		data[4] = 0;
	}

	if (data[4] < 20) {
		event.cancel();
	}
});


BlockEvents.broken("minecraft:trapped_chest", event => {
	if (!event.player.creative && !event.block.inventory.empty) {
		event.cancel();
	}
});