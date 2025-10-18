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