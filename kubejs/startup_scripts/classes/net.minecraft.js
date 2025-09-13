/** @type {typeof import("net.minecraft.world.entity.LivingEntity").$LivingEntity } */
const $LivingEntity = Java.loadClass("net.minecraft.world.entity.LivingEntity")

/** @type {typeof import("net.minecraft.world.entity.projectile.AbstractArrow").$AbstractArrow } */
const $AbstractArrow = Java.loadClass("net.minecraft.world.entity.projectile.AbstractArrow")

/** @type {typeof import("net.minecraft.tags.DamageTypeTags").$DamageTypeTags} */
const $DamageTypeTags = Java.loadClass("net.minecraft.tags.DamageTypeTags");

/** @type {typeof import("net.minecraft.world.entity.player.Player").$Player } */
const $Player = Java.loadClass("net.minecraft.world.entity.player.Player")

/** @type {typeof import("net.minecraft.world.effect.MobEffectInstance").$MobEffectInstance } */
const $MobEffectInstance = Java.loadClass("net.minecraft.world.effect.MobEffectInstance")

/** @type {typeof import("net.minecraft.network.protocol.game.ClientboundSetEntityMotionPacket").$ClientboundSetEntityMotionPacket } */
const $ClientboundSetEntityMotionPacket = Java.loadClass("net.minecraft.network.protocol.game.ClientboundSetEntityMotionPacket")

/** @type {typeof import("net.minecraft.world.phys.Vec3").$Vec3 } */
const $Vec3 = Java.loadClass("net.minecraft.world.phys.Vec3")

/** @type {typeof import("net.minecraft.world.InteractionResult").$InteractionResult } */
const $InteractionResult = Java.loadClass("net.minecraft.world.InteractionResult")

/** @type {typeof import("net.minecraft.world.item.Items").$Items } */
const $Items = Java.loadClass("net.minecraft.world.item.Items")

/** @type {typeof import("net.minecraft.world.item.BowItem").$BowItem } */
const $BowItem = Java.loadClass("net.minecraft.world.item.BowItem")