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