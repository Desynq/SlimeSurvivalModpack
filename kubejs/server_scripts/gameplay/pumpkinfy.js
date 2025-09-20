ServerEvents.tick(event => {
	event.server.runCommandSilent(`execute as @e[type=mutantmonsters:mutant_snow_golem] run team join pumpkin @s`)
})