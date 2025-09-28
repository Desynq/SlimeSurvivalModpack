ServerEvents.tick(event => {
	// immaculate code
	event.server.runCommandSilent(`execute as @e[type=mutantmonsters:mutant_snow_golem] run team join pumpkin @s`);

	event.server.getEntities() // @ts-ignore
		.filter((e: Entity_) => e.monster)
		.forEach(e => CommandHelper.runCommandSilent(event.server, `execute as ${e.username} if entity @s[team=] run team join monsters @s`));
});