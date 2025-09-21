
/** @type {typeof import("net.minecraft.world.entity.ai.targeting.TargetingConditions").$TargetingConditions } */
let $TargetingConditions = Java.loadClass("net.minecraft.world.entity.ai.targeting.TargetingConditions")
ServerEvents.tick(event => SteveManager.allTick(event.server));

const SteveManager = {};

const BOT_USERNAMES = ["Steve", "Alex", "Bot0", "Bot1", "Bot2", "Bot3", "Bot4", "Bot5", "Bot5", "Bot6", "Bot7", "Bot8", "Bot9"];

/**
 * 
 * @param {MinecraftServer} server 
 */
SteveManager.allTick = function(server) {
	BOT_USERNAMES.forEach(username => {
		SteveManager.username = username;
		SteveManager.tick(server)
	});
}

/** @type {string} */
SteveManager.username;


/**
 * @param {import("net.minecraft.server.MinecraftServer").$MinecraftServer$$Original} server 
 */
SteveManager.tick = function(server) {
	if (!SteveManager.isSteveOnline(server)) {
		return;
	}

	const nearestLivingEntity = SteveManager.getNearestLivingEntity(server);
	if (nearestLivingEntity == null) {
		SteveManager.stop(server);
		return;
	}

	SteveManager.lookAt(server, nearestLivingEntity.eyePosition);
	SteveManager.autoAttack(server);
}


/**
 * @param {import("net.minecraft.server.MinecraftServer").$MinecraftServer$$Original} server 
 */
SteveManager.isSteveOnline = function(server) {
	return SteveManager.getSteve(server) != null;
}

/**
 * @param {import("net.minecraft.server.MinecraftServer").$MinecraftServer$$Original} server 
 */
SteveManager.getSteve = function(server) {
	return server.playerList.getPlayerByName(SteveManager.username);
}

/**
 * @param {import("net.minecraft.server.MinecraftServer").$MinecraftServer$$Original} server
 * @returns {import("net.minecraft.server.level.ServerPlayer").$ServerPlayer$$Original | null}
 */
SteveManager.getNearestLivingEntity = function(server) {
	const steve = SteveManager.getSteve(server);
	const radius = 64;
	const aabb = AABB.of(
		steve.x + 128, steve.y + 128, steve.z + 128,
		steve.x - 128, steve.y - 8, steve.z - 128
	);
	const targetingConditions = $TargetingConditions.forNonCombat().selector(e => SteveManager.canTarget(e));
	return steve.level.getNearestEntity($LivingEntity, targetingConditions, steve, steve.x, steve.y, steve.z, aabb);
}

/**
 * @param {import("net.minecraft.world.entity.LivingEntity").$LivingEntity$$Original} entity 
 */
SteveManager.canTarget = function(entity) {
	const player = entity instanceof $ServerPlayer ? entity : null;
	if (!player) {
		return !(entity instanceof $Creeper)
	}
	if (BOT_USERNAMES.map(x => x.toLowerCase()).indexOf(player.username.toLowerCase()) !== -1) {
		return false;
	}
	return PlayerHelper.isSurvivalLike(player);
}

/**
 * @param {import("net.minecraft.server.MinecraftServer").$MinecraftServer$$Original} server 
 * @param {import("net.minecraft.world.phys.Vec3").$Vec3$$Original} vec3 
 */
SteveManager.lookAt = function(server, vec3) {
	server.runCommandSilent(`player ${SteveManager.username} look at ${vec3.x()} ${vec3.y()} ${vec3.z()}`);
}

SteveManager.autoAttack = function(server) {
	const username = SteveManager.username;
	server.runCommandSilent(`player ${username} move forward`);
	server.runCommandSilent(`player ${username} jump once`);
	server.runCommandSilent(`player ${username} sprint`);

	if (SteveManager.getSteve(server).getAttackStrengthScale(1) >= 1) {
		server.runCommandSilent(`player ${username} attack once`);
	}
}

/**
 * @param {import("net.minecraft.server.MinecraftServer").$MinecraftServer$$Original} server 
 * @param {import("net.minecraft.world.entity.LivingEntity").$LivingEntity$$Original} targetEntity 
 */
SteveManager.mineForward = function(server) {
	const steve = SteveManager.getSteve(server);

	const lookVec = steve.getLookAngle();
	const frontX = Math.floor(steve.x + lookVec.x);
	const frontY = Math.floor(steve.y);
	const frontZ = Math.floor(steve.z + lookVec.z);

	const blockInFront = steve.level.getBlockState(frontX, frontY, frontZ);
}

SteveManager.stop = function(server) {
	server.runCommandSilent(`player ${SteveManager.username} stop`);
}