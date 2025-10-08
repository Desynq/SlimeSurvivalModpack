"use strict";
// priority: 0
/** @type {typeof import("net.neoforged.neoforge.common.util.Lazy").$Lazy} */
var $Lazy = Java.loadClass("net.neoforged.neoforge.common.util.Lazy");
/** @type {typeof import("net.neoforged.neoforge.client.event.RegisterKeyMappingsEvent").$RegisterKeyMappingsEvent} */
var $RegisterKeyMappingsEvent = Java.loadClass("net.neoforged.neoforge.client.event.RegisterKeyMappingsEvent");
var PRIMARY_ABILITY_KEY = $Lazy.of(function () { return new $KeyMapping("key.slimesurvival.primary_ability", $InputConstants$Type.KEYSYM, GLFW.GLFW_KEY_Q, "key.categories.slimesurvival"); });
var SECONDARY_ABILITY_KEY = $Lazy.of(function () { return new $KeyMapping("key.slimesurvival.secondary_ability", $InputConstants$Type.KEYSYM, GLFW.GLFW_KEY_E, "key.categories.slimesurvival"); });
var TERTIARY_ABILITY_KEY = $Lazy.of(function () { return new $KeyMapping("key.slimesurvival.tertiary_ability", $InputConstants$Type.KEYSYM, GLFW.GLFW_KEY_R, "key.categories.slimesurvival"); });
var KEYS = [PRIMARY_ABILITY_KEY, SECONDARY_ABILITY_KEY, TERTIARY_ABILITY_KEY];
NativeEvents.onEvent($RegisterKeyMappingsEvent, function (event) {
    KEYS.forEach(function (key) { return event.register(key.get()); });
});
ClientEvents.tick(function (event) {
    KEYS.map(function (key) { return key.get(); }).forEach(function (key) {
        if (key.consumeClick()) {
            var payload = new $CompoundTag();
            payload.putString("key", key.getName());
            Client.player.sendData("KeyPressed", payload);
        }
    });
});
