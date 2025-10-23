/** @type {typeof import("dev.latvian.mods.kubejs.level.ExplosionProperties").$ExplosionProperties } */
let $ExplosionProperties = Java.loadClass("dev.latvian.mods.kubejs.level.ExplosionProperties");

BlockEvents.rightClicked(event => {
	let block = event.getBlock();
	if (!block.getId().includes('bed')) return;

	const pos = block.getPos();
	const biome = block.getLevel().getBiome(pos as any).getRegisteredName();

	const isHellBiome = biome.includes('nether')
		|| ["minecraft:soul_sand_valley"].includes(biome);

	if (!isHellBiome) return;

	block.set(Blocks.AIR as any);
	const level = event.level;
	// @ts-ignore
	level.explode(null, level.damageSources().badRespawnPointExplosion(pos), null, pos, 5.0, true, "block");
	event.cancel();
});