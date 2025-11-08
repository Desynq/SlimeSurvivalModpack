
const ServerDataHelper = {};

/**
 * @param {MinecraftServer_} server
 * @param {string} key 
 * @param {(tag: import("net.minecraft.nbt.CompoundTag").$CompoundTag$$Original) => void} valueFn 
 */
ServerDataHelper.modifyCompoundTag = function(server, key, valueFn) {
	const compoundTag = server.persistentData.getCompound(key);

	valueFn(compoundTag);

	server.persistentData.put(key, compoundTag);
}