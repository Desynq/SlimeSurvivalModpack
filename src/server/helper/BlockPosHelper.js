const BlockPosHelper = {}

/**
 * Converts a BlockPos object to a JavaScript number array so that's easier to modify its data.
 * @param {import("net.minecraft.core.BlockPos").$BlockPos$$Original} pos 
 */
BlockPosHelper.toIntArray = function(pos) {
	return [pos.getX(), pos.getY(), pos.getZ()];
}