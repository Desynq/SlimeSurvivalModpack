/** @type {typeof import("dev.latvian.mods.kubejs.level.ExplosionProperties").$ExplosionProperties } */
let $ExplosionProperties = Java.loadClass("dev.latvian.mods.kubejs.level.ExplosionProperties")

BlockEvents.rightClicked(event => {
	let block = event.getBlock();
	if (!block.getId().includes('bed')) return;
	if (!(block.getLevel().getBiome(block.getPos()).getRegisteredName()).includes('nether')) return;
	block.set(Blocks.AIR)
	let pos = {}
	pos.x = block.getPos().getX();
	pos.y = block.getPos().getY();
	pos.z = block.getPos().getZ();
	event.server.runCommandSilent(`summon creeper ${pos.x} ${pos.y} ${pos.z} {Fuse:0,ExplosionRadius:5,active_effects:[{id:"minecraft:wither",duration:1}],powered:true}`)
	event.cancel();
})