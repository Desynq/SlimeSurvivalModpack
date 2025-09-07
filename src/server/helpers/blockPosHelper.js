const BlockPosHelper = {}

/**
 * 
 * @param {$BlockPos_} pos 
 */
BlockPosHelper.toIntArray = function (pos) {
	return [pos.getX(), pos.getY(), pos.getZ()];
}