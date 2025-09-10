let $LivingHealEvent = Java.loadClass("net.neoforged.neoforge.event.entity.living.LivingHealEvent");
EntityEvents.beforeHurt("minecraft:player", event => {
	const { player, source } = event;
	if (source.type().msgId() == "fireworks" && player.tags.contains("boss")) {
		event.cancel();
	}
});