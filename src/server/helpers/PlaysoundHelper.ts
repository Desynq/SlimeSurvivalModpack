// priority: 1000

function playsound(level: ServerLevel_ | Level_, position: Vec3_, sound: string, volumeType: string, volume: number, pitch: number): void {
	CommandHelper.runCommandSilent(level.server,
		`execute in ${level.dimension.toString()} positioned ${position.x()} ${position.y()} ${position.z()} run playsound ${sound} ${volumeType} @a ~ ~ ~ ${volume} ${pitch}`
	);
}

function playsoundAll(server: MinecraftServer_, sound: string, volumeType: string, volume: number, pitch: number): void {
	server.getPlayerList().getPlayers().forEach(player => {
		CommandHelper.runCommandSilent(server,
			`execute as ${player.username} at @s run playsound ${sound} ${volumeType} @s ~ ~ ~ ${volume} ${pitch}`
		);
	});
}



namespace PlaysoundHelper {

	export function playsound(level: ServerLevel_ | Level_, position: Vec3_, sound: string, volumeType: string, volume: number, pitch: number): void {
		CommandHelper.runCommandSilent(level.server,
			`execute in ${level.dimension.toString()} positioned ${position.x()} ${position.y()} ${position.z()} run playsound ${sound} ${volumeType} @a ~ ~ ~ ${volume} ${pitch}`
		);
	}

	export function playsoundSelf(player: ServerPlayer_, position: Vec3_, sound: string, volumeType: string, volume: number, pitch: number): void {
		CommandHelper.runCommandSilent(player.server,
			`execute in ${player.level.dimension.toString()} positioned ${position.x()} ${position.y()} ${position.z()} run playsound ${sound} ${volumeType} ${player.username} ~ ~ ~ ${volume} ${pitch}`
		);
	}

	/**
	 * Plays the sound directly in front of the player
	 */
	export function playsoundAhead(player: ServerPlayer_, sound: string, volumeType: string, volume: number, pitch: number): void {
		const eyePos = player.getEyePosition();
		const lookVec = player.getLookAngle();
		const soundPos = eyePos.add(lookVec.scale(1.0) as any);

		playsound(player.level, soundPos, sound, volumeType, volume, pitch);
	}

	/**
	 * Plays the sound directly in front of the player
	 */
	export function playsoundAheadSelf(player: ServerPlayer_, sound: string, volumeType: string, volume: number, pitch: number): void {
		const eyePos = player.getEyePosition();
		const lookVec = player.getLookAngle();
		const soundPos = eyePos.add(lookVec.scale(1.0) as any);

		playsoundSelf(player, soundPos, sound, volumeType, volume, pitch);
	}

	export function playsoundLevel(level: Level_, sound: string, volumeType: string, volume: number, pitch: number): void {
		const dimension = level.dimension.toString();
		CommandHelper.runCommandSilent(level.server,
			`execute in ${dimension} as @a[distance=0..] at @s run playsound ${sound} ${volumeType} @s ~ ~ ~ ${volume} ${pitch}`
		);
	}

	export function playsoundGlobal(server: MinecraftServer_, sound: string, volumeType: string, volume: number, pitch: number): void {
		server.getPlayerList().getPlayers().forEach(player => {
			CommandHelper.runCommandSilent(server,
				`execute as ${player.username} at @s run playsound ${sound} ${volumeType} @s ~ ~ ~ ${volume} ${pitch}`
			);
		});
	}
}