// priority: 10000
// @ts-nocheck

const $KubeJS: typeof import("dev.latvian.mods.kubejs.KubeJS").$KubeJS = Java.loadClass('dev.latvian.mods.kubejs.KubeJS');

type EntitySpawnedKubeEvent_ = import("dev.latvian.mods.kubejs.entity.EntitySpawnedKubeEvent").$EntitySpawnedKubeEvent$$Original;
const $EntitySpawnedKubeEvent = Java.loadClass("dev.latvian.mods.kubejs.entity.EntitySpawnedKubeEvent");

type LivingEntityDeathKubeEvent_ = import("dev.latvian.mods.kubejs.entity.LivingEntityDeathKubeEvent").$LivingEntityDeathKubeEvent$$Original;
const $LivingEntityDeathKubeEvent = Java.loadClass("dev.latvian.mods.kubejs.entity.LivingEntityDeathKubeEvent");


type AfterLivingEntityHurtKubeEvent_ = import("dev.latvian.mods.kubejs.entity.AfterLivingEntityHurtKubeEvent").$AfterLivingEntityHurtKubeEvent$$Original;
const $AfterLivingEntityHurtKubeEvent = Java.loadClass("dev.latvian.mods.kubejs.entity.AfterLivingEntityHurtKubeEvent");

type CheckLivingEntitySpawnKubeEvent_ = import("dev.latvian.mods.kubejs.entity.CheckLivingEntitySpawnKubeEvent").$CheckLivingEntitySpawnKubeEvent;