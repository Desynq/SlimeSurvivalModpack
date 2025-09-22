let $TntBlock: typeof import("net.minecraft.world.level.block.TntBlock").$TntBlock = Java.loadClass("net.minecraft.world.level.block.TntBlock");
let $ExplosionEvent$Detonate: typeof import("net.neoforged.neoforge.event.level.ExplosionEvent$Detonate").$ExplosionEvent$Detonate = Java.loadClass("net.neoforged.neoforge.event.level.ExplosionEvent$Detonate");

namespace NoExplosionBlockDamage {
	function inBlacklistedDimension(level: import("net.minecraft.world.level.Level").$Level$$Original) {
		switch (level.getDimension().toString()) {
			case "slimesurvival:wipe":
				return true;
			default:
				return false;
		}
	}

	function pruneAffectedBlocks(
		affected: import("java.util.List").$List$$Original<import("net.minecraft.core.BlockPos").$BlockPos$$Original>,
		level: import("net.minecraft.world.level.Level").$Level$$Original
	) {
		const keepers: import("net.minecraft.core.BlockPos").$BlockPos$$Original[] = [];
		affected.forEach(pos => {
			// @ts-ignore
			const state = level.getBlockState(pos);
			// @ts-ignore
			if (state.getBlock() instanceof $TntBlock && state.getValue($TntBlock.UNSTABLE)) {
				keepers.push(pos);
			}
		});

		affected.clear();
		affected.addAll(keepers);
	}

	function pruneAffectedBlocksOld(
		affected: import("java.util.List").$List$$Original<import("net.minecraft.core.BlockPos").$BlockPos$$Original>,
		level: import("net.minecraft.world.level.Level").$Level$$Original
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
		if (!inBlacklistedDimension(event.getLevel())) return;

		// shit broke
		// pruneAffectedBlocks(event.getAffectedBlocks(), event.getLevel());
		pruneAffectedBlocksOld(event.getAffectedBlocks(), event.getLevel());
	});
}