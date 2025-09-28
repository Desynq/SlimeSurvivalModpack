/** @type {typeof import("net.minecraft.world.level.levelgen.Heightmap$Types").$Heightmap$Types } */
let $Heightmap$Types = Java.loadClass("net.minecraft.world.level.levelgen.Heightmap$Types")


const TenuemBoss = {};

/**
 * 
 * @param {LivingEntity_} entity 
 */
TenuemBoss.isTenuem = function(entity) {
	return entity.getTags().contains("boss.tenuem");
}

/**
 * 
 * @param {LivingEntity_} boss 
 */
TenuemBoss.tick = function(boss) {
	if (boss.dead) {
		return;
	}

	if (!boss.level.isThundering()) {
		boss.server.runCommandSilent("weather thunder 1d");
	}

	if (boss.server.tickCount % 400 == 400 - 20) {
		// @ts-ignore
		boss.level.players.forEach(player => TenuemBoss.warnPlayer(player));
	}

	if (boss.server.tickCount % 400 == 0) {
		// @ts-ignore
		boss.level.players.forEach(player => TenuemBoss.trySmitePlayer(player));
	}
}

/**
 * 
 * @param {Player_} player 
 */
TenuemBoss.warnPlayer = function(player) {
	player.server.runCommandSilent(`execute as ${player.username} at @s run playsound minecraft:item.trident.thunder master @s ${player.x} ${player.y} ${player.z} 4 0.5`);
}

/**
 * 
 * @param {Player_} player 
 */
TenuemBoss.trySmitePlayer = function(player) {
	if (!PlayerHelper.isSurvivalLike(player) || !player.onGround()) {
		return;
	}

	// @ts-ignore
	const strikeZone = player.level.getHeightmapPos($Heightmap$Types.MOTION_BLOCKING, player.blockPosition());
	tellOperators(player.server, strikeZone.toString());
	player.server.runCommandSilent(`summon minecraft:lightning_bolt ${strikeZone.x} ${strikeZone.y} ${strikeZone.z}`);
}

EntityEvents.death("minecraft:phantom", event => {
	const entity = event.entity;
	if (!TenuemBoss.isTenuem(entity)) {
		return;
	}

	event.server.runCommandSilent("weather thunder 1t");
})