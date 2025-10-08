// priority: 1000

/** @type {typeof import("net.minecraft.client.KeyMapping").$KeyMapping} */
const $KeyMapping = Java.loadClass("net.minecraft.client.KeyMapping");

/** @type {typeof import("net.minecraft.nbt.CompoundTag").$CompoundTag} */
const $CompoundTag = Java.loadClass("net.minecraft.nbt.CompoundTag");

const $Minecraft = Java.loadClass("net.minecraft.client.Minecraft");

/** @type {typeof import("net.minecraft.world.entity.player.Player").$Player} */
const $Player = Java.loadClass("net.minecraft.world.entity.player.Player");