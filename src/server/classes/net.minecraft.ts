// priority: 10000

type BlockState_ = import("net.minecraft.world.level.block.state.BlockState").$BlockState$$Original;
const $BlockState: typeof import("net.minecraft.world.level.block.state.BlockState").$BlockState = Java.loadClass("net.minecraft.world.level.block.state.BlockState");

type Blocks_ = import("net.minecraft.world.level.block.Blocks").$Blocks$$Original;
const $Blocks: typeof import("net.minecraft.world.level.block.Blocks").$Blocks = Java.loadClass("net.minecraft.world.level.block.Blocks");

// @ts-ignore
type TagParser_ = import("net.minecraft.nbt.TagParser").$TagParser$$Original;
// @ts-ignore
const $TagParser: typeof import("net.minecraft.nbt.TagParser").$TagParser = Java.loadClass("net.minecraft.nbt.TagParser");

type CompoundTag_ = import("net.minecraft.nbt.CompoundTag").$CompoundTag$$Original;
const $CompoundTag: typeof import("net.minecraft.nbt.CompoundTag").$CompoundTag = Java.loadClass("net.minecraft.nbt.CompoundTag");

// @ts-ignore
type SummonCommand_ = import("net.minecraft.server.commands.SummonCommand").$SummonCommand$$Original;
// @ts-ignore
const $SummonCommand: typeof import("net.minecraft.server.commands.SummonCommand").$SummonCommand = Java.loadClass("net.minecraft.server.commands.SummonCommand");


const $TargetingConditions: typeof import("net.minecraft.world.entity.ai.targeting.TargetingConditions").$TargetingConditions = Java.loadClass("net.minecraft.world.entity.ai.targeting.TargetingConditions");

type ItemEntity_ = import("net.minecraft.world.entity.item.ItemEntity").$ItemEntity$$Original;
const $ItemEntity: typeof import("net.minecraft.world.entity.item.ItemEntity").$ItemEntity = Java.loadClass("net.minecraft.world.entity.item.ItemEntity");


// @ts-ignore
const $AvoidEntityGoal: typeof import("net.minecraft.world.entity.ai.goal.AvoidEntityGoal").$AvoidEntityGoal = Java.loadClass("net.minecraft.world.entity.ai.goal.AvoidEntityGoal");

// @ts-ignore
const $PanicGoal: typeof import("net.minecraft.world.entity.ai.goal.PanicGoal").$PanicGoal = Java.loadClass("net.minecraft.world.entity.ai.goal.PanicGoal");

type LivingIncomingDamageEvent_ = import("net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent").$LivingIncomingDamageEvent$$Original;
const $LivingIncomingDamageEvent: typeof import("net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent").$LivingIncomingDamageEvent = Java.loadClass("net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent");

// @ts-ignore
const $TagKey: typeof import("net.minecraft.tags.TagKey").$TagKey = Java.loadClass("net.minecraft.tags.TagKey");