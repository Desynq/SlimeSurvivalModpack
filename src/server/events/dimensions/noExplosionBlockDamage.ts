// @ts-ignore
let $TntBlock: typeof import("net.minecraft.world.level.block.TntBlock").$TntBlock = Java.loadClass("net.minecraft.world.level.block.TntBlock");
let $ExplosionEvent$Detonate: typeof import("net.neoforged.neoforge.event.level.ExplosionEvent$Detonate").$ExplosionEvent$Detonate = Java.loadClass("net.neoforged.neoforge.event.level.ExplosionEvent$Detonate");

namespace NoExplosionBlockDamage {
	function inWhitelistedDimension(level: ServerLevel_) {
		const dimension = level.getDimension().toString();
		switch (dimension) {
			case "minecraft:overworld":
				return true;
			default:
				return false;
		}
	}

	function pruneAffectedBlocksOld(
		affected: import("java.util.List").$List$$Original<import("net.minecraft.core.BlockPos").$BlockPos$$Original>,
		level: ServerLevel_
	) {
		affected.removeIf(pos => {
			// @ts-ignore
			const state = level.getBlockState(pos);
			if (state.getBlock() instanceof $TntBlock) {
				// @ts-ignore
				return !state.getValue($TntBlock.UNSTABLE);
			}
			return true;
		});
	}

	NativeEvents.onEvent($ExplosionEvent$Detonate, event => {
		const blocks = event.getAffectedBlocks();
		const level = event.getLevel() as ServerLevel_;
		if (inWhitelistedDimension(level)) return;

		pruneAffectedBlocksOld(blocks, level);
	});
}