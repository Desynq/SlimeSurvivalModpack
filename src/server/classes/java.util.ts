// priority: 10000

type Map_<K, V> = import("java.util.Map").$Map<K, V>;
const $HashMap: typeof import("java.util.HashMap").$HashMap = Java.loadClass("java.util.HashMap");

type UUID_ = import("java.util.UUID").$UUID;
const $UUID: typeof import("java.util.UUID").$UUID =
	Java.loadClass("java.util.UUID");

const $HashSet: typeof import("java.util.HashSet").$HashSet =
	Java.loadClass("java.util.HashSet");

const $LinkedHashSet: typeof import("java.util.LinkedHashSet").$LinkedHashSet =
	Java.loadClass("java.util.LinkedHashSet");

const $LinkedHashMap: typeof import("java.util.LinkedHashMap").$LinkedHashMap =
	Java.loadClass("java.util.LinkedHashMap");


type Set_<E> = import("java.util.Set").$Set<E>;


type Optional_<T> = import("java.util.Optional").$Optional<T>;
const $Optional: typeof import("java.util.Optional").$Optional =
	Java.loadClass("java.util.Optional");