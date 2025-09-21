BlockEvents.leftClicked(e => {
	let block = e.getBlock()
	if (block.getId() == 'minecraft:obsidian') {
		let pos = block.getPos()
		let server = e.server
		let world = server.overworld();
		let stationpos = pos.below(2)
		// @ts-ignore
		let air = world.getBlock(pos.below(1))
		if (air.getId() != 'minecraft:air') {
			return
		}
		// @ts-ignore
		let station = world.getBlock(stationpos)
		if (station.getId() != 'minecraft:bedrock') {
			return
		}
		let minX = stationpos.x
		let minY = stationpos.y + 1
		let minZ = stationpos.z
		let maxX = stationpos.x + 1
		let maxY = stationpos.y + 2
		let maxZ = stationpos.z + 1
		// @ts-ignore
		let items = server.getEntities().filter(entity => {
			if (entity.getType() != 'minecraft:item') return false
			let x = entity.x
			let y = entity.y
			let z = entity.z
			return (
				x >= minX && x < maxX &&
				y >= minY && y < maxY &&
				z >= minZ && z < maxZ
			)
		})

		items.forEach(item => {
			let stack = item.getItem()
			let count = stack.getCount()
			// @ts-ignore
			if (stack.getId() == 'minecraft:diamond') {
				item.kill();
				// @ts-ignore
				block.set('minecraft:air')
				// @ts-ignore
				air.set('minecraft:obsidian')
				// @ts-ignore
				station.popItemFromFace(Item.of('minecraft:quartz', 16 * count), 'up')
				playsound(world, e.getPlayer().getPosition(0), 'block.anvil.land', 'master', 2, 1)
			}
		})
	}
});
