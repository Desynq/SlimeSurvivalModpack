/**
 * 
 * @param {Entity_} entity
 */

function hasPumpkinHead(entity) {
	const headItem = entity.getSlot(103).get()
	return headItem.id === 'minecraft:carved_pumpkin';
}


/***
 * @param {import("dev.latvian.mods.kubejs.server.ServerKubeEvent").$ServerKubeEvent$$Original} event
 */
function updatePumpkinTeams(event) {
	event.server.runCommandSilent('team add pumpkin');
	event.server.runCommandSilent('team modify pumpkin color gold');

	event.server.getEntities().forEach(entity => {
		if (!entity.type) { return; }

		if (hasPumpkinHead(entity)) {
			event.server.runCommandSilent(`team join pumpkin ${entity.getUuid()}`)
		} else {
			event.server.runCommandSilent(`team leave ${entity.getUuid()}`)
		}
	})
}

// ServerEvents.tick(event => { updatePumpkinTeams(event) });