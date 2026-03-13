// priority: 10000

type Map_<K, V> = import("java.util.Map").$Map<K, V>;
const $Map: typeof import("java.util.Map").$Map = Java.loadClass("java.util.Map");

type UUID_ = import("java.util.UUID").$UUID;
const $UUID: typeof import("java.util.UUID").$UUID = Java.loadClass("java.util.UUID");