// net.minecraft.nbt


const $Tag: typeof import("net.minecraft.nbt.Tag").$Tag =
	Java.loadClass("net.minecraft.nbt.Tag");

const $StringTag = Java.loadClass('net.minecraft.nbt.StringTag');

type ListTag_ = import("net.minecraft.nbt.ListTag").$ListTag;
const $ListTag: typeof import("net.minecraft.nbt.ListTag").$ListTag =
	Java.loadClass("net.minecraft.nbt.ListTag");

const $GameRules: typeof import("net.minecraft.world.level.GameRules").$GameRules =
	Java.loadClass("net.minecraft.world.level.GameRules");


const $Comparator: typeof import("java.util.Comparator").$Comparator =
	Java.loadClass("java.util.Comparator");

// @ts-expect-error
const $ServerReloadedEvent: typeof import("net.blay09.mods.balm.api.event.server.ServerReloadedEvent").$ServerReloadedEvent =
	Java.loadClass("net.blay09.mods.balm.api.event.server.ServerReloadedEvent");

// @ts-expect-error
const $MobEffectInstance: typeof import("net.minecraft.world.effect.MobEffectInstance").$MobEffectInstance =
	Java.loadClass("net.minecraft.world.effect.MobEffectInstance");



const $StringArgumentType = Java.loadClass("com.mojang.brigadier.arguments.StringArgumentType");

// @ts-expect-error
const $Commands: typeof import("net.minecraft.commands.Commands").$Commands =
	Java.loadClass("net.minecraft.commands.Commands");

// @ts-expect-error
const $Arguments: typeof import("dev.latvian.mods.kubejs.command.ArgumentTypeWrappers").$ArgumentTypeWrappers =
	Java.loadClass("dev.latvian.mods.kubejs.command.ArgumentTypeWrappers");



type $EquipmentSlot$$Type = import("net.minecraft.world.entity.EquipmentSlot").$EquipmentSlot$$Type;