ServerEvents.tick(event => {
	// immaculate code
	event.server.runCommandSilent(`execute as @e[type=mutantmonsters:mutant_snow_golem] run team join pumpkin @s`)
});