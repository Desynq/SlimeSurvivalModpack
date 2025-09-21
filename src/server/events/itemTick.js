


ServerEvents.tick(event => {
	const server = event.server;

	const itemEntities = server.getEntities().filter(e => e.type === "minecraft:item");

	// @ts-ignore
	itemEntities.filter(e => isChlorineGasGrenade(e)).forEach(e => new ChlorineGasGrenadeTick(e));

	const groundedItemEntities = itemEntities.filter(e => e.onGround());

	const unbreakingTomes = groundedItemEntities.filter(e => e.item.id == "slimesurvival:unbreaking_tome");

	// @ts-ignore
	unbreakingTomes.forEach(tome => UnbreakingTomeTick(tome, groundedItemEntities));
});