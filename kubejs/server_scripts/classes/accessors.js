// net.minecraft.nbt
const $Tag = Java.loadClass("net.minecraft.nbt.Tag");
const $CompoundTag = Java.loadClass("net.minecraft.nbt.CompoundTag");
const $StringTag = Java.loadClass('net.minecraft.nbt.StringTag');
const $ListTag = Java.loadClass("net.minecraft.nbt.ListTag");


const $GameRules = Java.loadClass("net.minecraft.world.level.GameRules");


const $Comparator = Java.loadClass("java.util.Comparator");


const $ServerReloadedEvent = Java.loadClass("net.blay09.mods.balm.api.event.server.ServerReloadedEvent");


/** @type {typeof import("net.minecraft.world.effect.MobEffectInstance").$MobEffectInstance} */
const $MobEffectInstance = Java.loadClass("net.minecraft.world.effect.MobEffectInstance");



const $StringArgumentType = Java.loadClass("com.mojang.brigadier.arguments.StringArgumentType");
const $Commands = Java.loadClass("net.minecraft.commands.Commands");
const $Arguments = Java.loadClass("dev.latvian.mods.kubejs.command.ArgumentTypeWrappers");