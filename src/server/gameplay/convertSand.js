
BlockEvents.rightClicked(event => {
	let item = event.getItem();
	let block = event.getBlock();
	if (item.isEmpty()) return;
	if (item.id !== 'minecraft:ghast_tear') return;
	if (block.getId() !== 'minecraft:sand') return;
	let world = event.getLevel();
	let player = event.getPlayer();
	let pos = block.getPos();
	world.setBlock(pos, Blocks.SOUL_SAND, 0);

	item.setCount(item.count - 1);
	playsound(world, pos, 'minecraft:block.sand.fall', 'block', 1, 1);
});