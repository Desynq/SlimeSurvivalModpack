/** @type {typeof import("net.minecraft.world.entity.boss.enderdragon.EnderDragon").$EnderDragon } */
let $EnderDragon = Java.loadClass("net.minecraft.world.entity.boss.enderdragon.EnderDragon")

const VoidmanBoss = {};

/**
 * 
 * @param {LivingEntity} entity 
 */
VoidmanBoss.isVoidman = function(entity) {
	return entity.getTags().contains("boss.voidman");
}

/**
 * 
 * @param {LivingEntity} boss 
 */
VoidmanBoss.tick = function(boss) {
	if (boss.dead) {
		return;
	}

	VoidmanBoss.makeAllEndermenAngry(boss.server);
}

/**
 * 
 * @param {MinecraftServer} server 
 */
VoidmanBoss.makeAllEndermenAngry = function(server) {
	CommandHelper.runCommandSilent(server, `execute as @e[type=mutantmonsters:mutant_enderman] at @s run data modify entity @s AngryAt set from entity @p[gamemode=!creative,gamemode=!spectator,distance=..64] UUID`);
	CommandHelper.runCommandSilent(server, `execute at @e[type=mutantmonsters:mutant_enderman,tag=boss.voidman] as @e[type=minecraft:enderman,distance=..64] at @s run data modify entity @s AngryAt set from entity @p[gamemode=!creative,gamemode=!spectator,distance=..64] UUID`);
}

EntityEvents.death("minecraft:player", event => {
	const player = event.player;

	if (!PlayerHelper.isSurvivalLike(player)) {
		return;
	}

	player.level.entities.filter(e => e instanceof $LivingEntity && VoidmanBoss.isVoidman(e)).forEach(/** @param {LivingEntity} voidman */ voidman => {
		voidman.setHealth(Math.min(voidman.health + 50, voidman.maxHealth));
	});
});

EntityEvents.beforeHurt("mutantmonsters:mutant_enderman", event => {
	const attacker = event.source.actual;
	if (attacker instanceof $EnderDragon) {
		event.cancel();
	}
});