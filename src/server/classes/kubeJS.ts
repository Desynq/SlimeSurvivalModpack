// priority: 10000

// @ts-ignore
const $KubeJS: typeof import("dev.latvian.mods.kubejs.KubeJS").$KubeJS = Java.loadClass('dev.latvian.mods.kubejs.KubeJS');

// @ts-ignore
type EntitySpawnedKubeEvent_ = import("dev.latvian.mods.kubejs.entity.EntitySpawnedKubeEvent").$EntitySpawnedKubeEvent$$Original;
const $EntitySpawnedKubeEvent = Java.loadClass("dev.latvian.mods.kubejs.entity.EntitySpawnedKubeEvent");

// @ts-ignore
type LivingEntityDeathKubeEvent_ = import("dev.latvian.mods.kubejs.entity.LivingEntityDeathKubeEvent").$LivingEntityDeathKubeEvent$$Original;
const $LivingEntityDeathKubeEvent = Java.loadClass("dev.latvian.mods.kubejs.entity.LivingEntityDeathKubeEvent");