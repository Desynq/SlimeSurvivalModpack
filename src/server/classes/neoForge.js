// priority: 1000

/** @type {typeof import("net.neoforged.neoforge.common.NeoForge").$NeoForge} */
const $NeoForge = Java.loadClass("net.neoforged.neoforge.common.NeoForge");

/** @type {typeof import("net.neoforged.bus.api.EventPriority").$EventPriority } */
const $EventPriority = Java.loadClass("net.neoforged.bus.api.EventPriority")

/** @type {typeof import("net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent").$LivingIncomingDamageEvent } */
const $LivingIncomingDamageEvent = Java.loadClass("net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent")

/**
 * @type {typeof import("net.neoforged.neoforge.event.entity.living.LivingEvent$LivingJumpEvent").$LivingEvent$LivingJumpEvent}
 */
const $LivingEvent$LivingJumpEvent = Java.loadClass("net.neoforged.neoforge.event.entity.living.LivingEvent$LivingJumpEvent");

/** @type {typeof import("net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$RightClickItem").$PlayerInteractEvent$RightClickItem } */
const $PlayerInteractEvent$RightClickItem = Java.loadClass("net.neoforged.neoforge.event.entity.player.PlayerInteractEvent$RightClickItem")

/** @type {typeof import("net.neoforged.neoforge.event.tick.EntityTickEvent$Post").$EntityTickEvent$Post } */
const $EntityTickEvent$Post = Java.loadClass("net.neoforged.neoforge.event.tick.EntityTickEvent$Post")

/** @type {typeof import("net.neoforged.neoforge.event.entity.living.LivingFallEvent").$LivingFallEvent } */
const $LivingFallEvent = Java.loadClass("net.neoforged.neoforge.event.entity.living.LivingFallEvent");

/** @type {typeof import("net.neoforged.neoforge.event.entity.ProjectileImpactEvent").$ProjectileImpactEvent} */
const $ProjectileImpactEvent = Java.loadClass("net.neoforged.neoforge.event.entity.ProjectileImpactEvent");

/** @type {typeof import("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Added").$MobEffectEvent$Added } */
const $MobEffectEvent$Added = Java.loadClass("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Added")

/** @type {typeof import("net.neoforged.neoforge.event.entity.living.LivingEntityUseItemEvent$Tick").$LivingEntityUseItemEvent$Tick } */
const $LivingEntityUseItemEvent$Tick = Java.loadClass("net.neoforged.neoforge.event.entity.living.LivingEntityUseItemEvent$Tick");

/** @type {typeof import("net.neoforged.neoforge.event.entity.living.LivingEntityUseItemEvent$Start").$LivingEntityUseItemEvent$Start } */
const $LivingEntityUseItemEvent$Start = Java.loadClass("net.neoforged.neoforge.event.entity.living.LivingEntityUseItemEvent$Start");

/** @type {typeof import("io.github.desynq.slimesurvival.event.PlayerEatEffectEvent").$PlayerEatEffectEvent } */
const $PlayerEatEffectEvent = Java.loadClass("io.github.desynq.slimesurvival.event.PlayerEatEffectEvent");