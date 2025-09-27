// @ts-nocheck
ItemEvents.rightClicked(event => {
	if (event.getItem().getId() == 'minecraft:iron_ingot') event.player.openMenu();
});