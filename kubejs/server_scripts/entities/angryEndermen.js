/** @type {typeof import("net.minecraft.world.entity.monster.EnderMan").$EnderMan } */
let $EnderMan = Java.loadClass("net.minecraft.world.entity.monster.EnderMan")

NativeEvents.onEvent($EntityTickEvent$Post, event => {
	const entity = event.getEntity();
	if (!(entity instanceof $EnderMan && entity.type === "endermanoverhaul:end_enderman")) {
		return;
	}

	CommandHelper.runCommandSilent(entity.level,
		`execute as ${entity.username} at @s run data modify entity @s AngryAt set from entity @p[gamemode=!creative,gamemode=!spectator,distance=..16] UUID`
	);
	CommandHelper.runCommandSilent(entity.level,
		`execute as ${entity.username} at @s run attribute @s minecraft:generic.max_health base set 20`
	);
	CommandHelper.runCommandSilent(entity.level,
		`execute as ${entity.username} at @s run attribute @s minecraft:generic.movement_speed base set 0.3`
	);
});