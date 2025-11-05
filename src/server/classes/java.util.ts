// priority: 10000

type Map_<K, V> = import("java.util.Map").$Map<K, V>;
const $Map: typeof import("java.util.Map").$Map = Java.loadClass("java.util.Map");