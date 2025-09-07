/** @type {typeof import("net.minecraft.world.entity.LivingEntity").$LivingEntity } */
const $LivingEntity  = Java.loadClass("net.minecraft.world.entity.LivingEntity")

/** @type {typeof import("net.minecraft.world.entity.projectile.AbstractArrow").$AbstractArrow } */
const $AbstractArrow  = Java.loadClass("net.minecraft.world.entity.projectile.AbstractArrow")

/** @type {typeof import("net.neoforged.neoforge.event.entity.player.AttackEntityEvent").$AttackEntityEvent } */
const $AttackEntityEvent  = Java.loadClass("net.neoforged.neoforge.event.entity.player.AttackEntityEvent")

/** @type {typeof import("fuzs.swordblockingmechanics.handler.SwordBlockingHandler").$SwordBlockingHandler} */
const $SwordBlockingHandler = Java.loadClass("fuzs.swordblockingmechanics.handler.SwordBlockingHandler");

/** @type {typeof import("fuzs.swordblockingmechanics.SwordBlockingHandler").$SwordBlockingMechanics} */
const $SwordBlockingMechanics = Java.loadClass("fuzs.swordblockingmechanics.SwordBlockingMechanics");

/** @type {typeof import("fuzs.swordblockingmechanics.config.ServerConfig").$SBMServerConfig} */
const $SBMServerConfig = Java.loadClass("fuzs.swordblockingmechanics.config.ServerConfig");

/** @type {typeof import("net.minecraft.tags.DamageTypeTags").$DamageTypeTags} */
const $DamageTypeTags = Java.loadClass("net.minecraft.tags.DamageTypeTags");

/** @type {typeof import("net.minecraft.world.entity.player.Player").$Player } */
const $Player  = Java.loadClass("net.minecraft.world.entity.player.Player")

/** @type {typeof import("net.minecraft.world.effect.MobEffectInstance").$MobEffectInstance } */
const $MobEffectInstance  = Java.loadClass("net.minecraft.world.effect.MobEffectInstance")

/** @type {typeof import("net.minecraft.network.protocol.game.ClientboundSetEntityMotionPacket").$ClientboundSetEntityMotionPacket } */
const $ClientboundSetEntityMotionPacket  = Java.loadClass("net.minecraft.network.protocol.game.ClientboundSetEntityMotionPacket")

/** @type {typeof import("net.neoforged.neoforge.event.entity.living.LivingEvent$LivingJumpEvent").$LivingEvent$LivingJumpEvent } */
const $LivingEvent$LivingJumpEvent  = Java.loadClass("net.neoforged.neoforge.event.entity.living.LivingEvent$LivingJumpEvent")

/** @type {typeof import("net.minecraft.world.phys.Vec3").$Vec3 } */
const $Vec3  = Java.loadClass("net.minecraft.world.phys.Vec3")

/** @type {typeof import("net.neoforged.bus.api.EventPriority").$EventPriority } */
const $EventPriority  = Java.loadClass("net.neoforged.bus.api.EventPriority")

/** @type {typeof import("net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent").$LivingIncomingDamageEvent } */
const $LivingIncomingDamageEvent  = Java.loadClass("net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent")