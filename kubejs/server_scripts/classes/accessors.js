// net.minecraft.nbt
const $Tag = Java.loadClass("net.minecraft.nbt.Tag");
const $CompoundTag = Java.loadClass("net.minecraft.nbt.CompoundTag");
const $StringTag = Java.loadClass('net.minecraft.nbt.StringTag');
const $ListTag = Java.loadClass("net.minecraft.nbt.ListTag");


const $ResourceLocation = Java.loadClass("net.minecraft.resources.ResourceLocation");


const $BuiltInRegistries = Java.loadClass("net.minecraft.core.registries.BuiltInRegistries");


const $GameRules = Java.loadClass("net.minecraft.world.level.GameRules");


const $Comparator = Java.loadClass("java.util.Comparator");


const $Attributes = Java.loadClass("net.minecraft.world.entity.ai.attributes.Attributes");


const $ServerPlayer = Java.loadClass("net.minecraft.server.level.ServerPlayer");

// in-house
const $TaskScheduler = Java.loadClass("io.github.desynq.slimesurvival.util.TaskScheduler");


const $ServerReloadedEvent = Java.loadClass("net.blay09.mods.balm.api.event.server.ServerReloadedEvent");


const $MobEffectInstance = Java.loadClass("net.minecraft.world.effect.MobEffectInstance");





const $StringArgumentType = Java.loadClass("com.mojang.brigadier.arguments.StringArgumentType");
const $Commands = Java.loadClass("net.minecraft.commands.Commands");
const $Arguments = Java.loadClass("dev.latvian.mods.kubejs.command.ArgumentTypeWrappers");