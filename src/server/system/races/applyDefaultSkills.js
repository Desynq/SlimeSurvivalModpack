/** @type {typeof import("net.neoforged.neoforge.event.OnDatapackSyncEvent").$OnDatapackSyncEvent } */
let $OnDatapackSyncEvent = Java.loadClass("net.neoforged.neoforge.event.OnDatapackSyncEvent")

NativeEvents.onEvent($OnDatapackSyncEvent, event => {
	event.getPlayerList().getPlayers().forEach(player => {
		// @ts-ignore
		PlayerRaceSkillHelper.unlockDefaultRaceSkills(player, RaceHelper.getRace(player));
	});
});