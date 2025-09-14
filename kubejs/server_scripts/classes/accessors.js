// net.minecraft.nbt
const $Tag = Java.loadClass("net.minecraft.nbt.Tag");

/** @type {typeof import("net.minecraft.nbt.CompoundTag").$CompoundTag} */
const $CompoundTag = Java.loadClass("net.minecraft.nbt.CompoundTag");
const $StringTag = Java.loadClass('net.minecraft.nbt.StringTag');
const $ListTag = Java.loadClass("net.minecraft.nbt.ListTag");

/** @type {typeof import("net.minecraft.world.level.GameRules").$GameRules} */
const $GameRules = Java.loadClass("net.minecraft.world.level.GameRules");


/** @type {typeof import("java.util.Comparator").$Comparator} */
const $Comparator = Java.loadClass("java.util.Comparator");

/** @type {typeof import("net.blay09.mods.balm.api.event.server.ServerReloadedEvent").$ServerReloadedEvent} */
const $ServerReloadedEvent = Java.loadClass("net.blay09.mods.balm.api.event.server.ServerReloadedEvent");


/** @type {typeof import("net.minecraft.world.effect.MobEffectInstance").$MobEffectInstance} */
const $MobEffectInstance = Java.loadClass("net.minecraft.world.effect.MobEffectInstance");



const $StringArgumentType = Java.loadClass("com.mojang.brigadier.arguments.StringArgumentType");

/** @type {typeof import("net.minecraft.commands.Commands").$Commands} */
const $Commands = Java.loadClass("net.minecraft.commands.Commands");

/** @type {typeof import("dev.latvian.mods.kubejs.command.ArgumentTypeWrappers").$ArgumentTypeWrappers} */
const $Arguments = Java.loadClass("dev.latvian.mods.kubejs.command.ArgumentTypeWrappers");