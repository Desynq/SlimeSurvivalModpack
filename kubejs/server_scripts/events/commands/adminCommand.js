ServerEvents.commandRegistry(event => {

	const nodes = {};

	nodes["/admin"] = $Commands.literal("admin");

	nodes["/admin summon"] = $Commands.literal("summon")
		// @ts-ignore
		.then($Commands.literal("voidman")
			.executes(context => {
				summonVoidman(context.source.level, context.source.position)
				return 1;
			})
		);

	nodes["/admin"]
		// @ts-ignore
		.then(nodes["/admin summon"]);

	// @ts-ignore
	event.register(nodes["/admin"]);



	/**
	 * 
	 * @param {import("net.minecraft.server.level.ServerLevel").$ServerLevel$$Original} level 
	 * @param {import("net.minecraft.world.phys.Vec3").$Vec3$$Original} position 
	 */
	function summonVoidman(level, position) {
		const dimension = level.dimension.toString();
		const x = position.x();
		const y = position.y();
		const z = position.z();
		const nbt = {
			Tags: ["boss", "boss.voidman"],
			PersistenceRequired: true,
			AngerTime: 2147483647,
			Health: 1000,
			attributes: [
				{
					id: "minecraft:generic.max_health",
					base: 1000
				},
				{
					id: "minecraft:generic.attack_damage",
					base: 10
				}
			],
			CustomName: '{"color":"dark_purple","text":"The Voidman"}'
		};
		CommandHelper.runCommandSilent(level.server, `execute in ${dimension} run summon mutantmonsters:mutant_enderman ${x} ${y} ${z} ${JSON.stringify(nbt)}`, true);
	}
});