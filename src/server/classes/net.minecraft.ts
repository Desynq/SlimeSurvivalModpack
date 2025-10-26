// priority: 10000
// @ts-nocheck

type BlockState_ = import("net.minecraft.world.level.block.state.BlockState").$BlockState$$Original;
const $BlockState: typeof import("net.minecraft.world.level.block.state.BlockState").$BlockState = Java.loadClass("net.minecraft.world.level.block.state.BlockState");

type Blocks_ = import("net.minecraft.world.level.block.Blocks").$Blocks$$Original;
const $Blocks: typeof import("net.minecraft.world.level.block.Blocks").$Blocks = Java.loadClass("net.minecraft.world.level.block.Blocks");

type TagParser_ = import("net.minecraft.nbt.TagParser").$TagParser$$Original;
const $TagParser: typeof import("net.minecraft.nbt.TagParser").$TagParser = Java.loadClass("net.minecraft.nbt.TagParser");

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

const $Phantom: typeof import("net.minecraft.world.entity.monster.Phantom").$Phantom = Java.loadClass("net.minecraft.world.entity.monster.Phantom");

const $AbstractArrow$Pickup: typeof import("net.minecraft.world.entity.projectile.AbstractArrow$Pickup").$AbstractArrow$Pickup = Java.loadClass("net.minecraft.world.entity.projectile.AbstractArrow$Pickup");

// @ts-ignore
const $Stats: typeof import("net.minecraft.stats.Stats").$Stats = Java.loadClass("net.minecraft.stats.Stats");

const $Pose: typeof import("net.minecraft.world.entity.Pose").$Pose = Java.loadClass("net.minecraft.world.entity.Pose");

// @ts-ignore
const $MinecraftServer: typeof import("net.minecraft.server.MinecraftServer").$MinecraftServer = Java.loadClass("net.minecraft.server.MinecraftServer");

// @ts-ignore
const $ClientboundContainerSetSlotPacket: typeof import("net.minecraft.network.protocol.game.ClientboundContainerSetSlotPacket").$ClientboundContainerSetSlotPacket = Java.loadClass("net.minecraft.network.protocol.game.ClientboundContainerSetSlotPacket");

// @ts-ignore
const $ShulkerBullet: typeof import("net.minecraft.world.entity.projectile.ShulkerBullet").$ShulkerBullet = Java.loadClass("net.minecraft.world.entity.projectile.ShulkerBullet");

// @ts-ignore
const $Direction$Axis: typeof import("net.minecraft.core.Direction$Axis").$Direction$Axis = Java.loadClass("net.minecraft.core.Direction$Axis");

const $DamageTypeTags: typeof import("net.minecraft.tags.DamageTypeTags").$DamageTypeTags = Java.loadClass("net.minecraft.tags.DamageTypeTags");

type EntityHitResult_ = import("net.minecraft.world.phys.EntityHitResult").$EntityHitResult$$Original;
const $EntityHitResult: typeof import("net.minecraft.world.phys.EntityHitResult").$EntityHitResult =
	Java.loadClass("net.minecraft.world.phys.EntityHitResult");

type AbstractArrow_ = import("net.minecraft.world.entity.projectile.AbstractArrow").$AbstractArrow$$Original;
const $AbstractArrow: typeof import("net.minecraft.world.entity.projectile.AbstractArrow").$AbstractArrow =
	Java.loadClass("net.minecraft.world.entity.projectile.AbstractArrow");

type LootTable_ = import("net.minecraft.world.level.storage.loot.LootTable").$LootTable;
type LootTableHolder_ = import("net.minecraft.core.Holder").$Holder<LootTable_>;

const $LootParams$Builder: typeof import("net.minecraft.world.level.storage.loot.LootParams$Builder").$LootParams$Builder =
	Java.loadClass("net.minecraft.world.level.storage.loot.LootParams$Builder");

const $LootContextParams: typeof import("net.minecraft.world.level.storage.loot.parameters.LootContextParams").$LootContextParams =
	Java.loadClass("net.minecraft.world.level.storage.loot.parameters.LootContextParams");

const $LootContextParamSets: typeof import("net.minecraft.world.level.storage.loot.parameters.LootContextParamSets").$LootContextParamSets =
	Java.loadClass("net.minecraft.world.level.storage.loot.parameters.LootContextParamSets");