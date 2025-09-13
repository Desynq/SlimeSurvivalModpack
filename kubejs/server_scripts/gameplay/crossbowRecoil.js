/** @type {typeof import("net.neoforged.neoforge.event.entity.player.ArrowLooseEvent").$ArrowLooseEvent } */
const $ArrowLooseEvent = Java.loadClass("net.neoforged.neoforge.event.entity.player.ArrowLooseEvent")

NativeEvents.onEvent($ArrowLooseEvent, event => {
	const player = event.entity instanceof $Player ? event.entity : null;
	if (player == null) {
		return;
	}

	$TaskScheduler.scheduleTask(player.server, 1, () => ApplyCrossbowRecoil(player));
});

/**
 * 
 * @param {Player} player 
 */
function ApplyCrossbowRecoil(player) {
	ActionbarManager.setSimple(player, player.getPitch(), 20);
	const yRecoil = 0;
	const xRecoil = -10;
	player.setRot(player.yRot, player.xRot + xRecoil);
	const recoilPacket = new $CompoundTag();
	recoilPacket.putFloat("yRot", yRecoil);
	recoilPacket.putFloat("xRot", xRecoil);
	player.server.sendData("Recoil", recoilPacket);
}