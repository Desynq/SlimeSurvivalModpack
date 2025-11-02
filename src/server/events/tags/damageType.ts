


ServerEvents.tags("damage_type", event => {
	[
		"minecraft:bypasses_armor",
		"minecraft:bypasses_cooldown",
		"minecraft:bypasses_effects",
		"minecraft:bypasses_enchantments",
		"minecraft:bypasses_invulnerability",
		"minecraft:bypasses_resistance",
		"minecraft:bypasses_shield",
		"minecraft:bypasses_wolf_armor",
		"minecraft:no_impact"
	].forEach(tag => {
		event.add(tag as any, "slimesurvival:entropy_kill" as any);
	});

	[
		"minecraft:bypasses_armor"
	].forEach(tag => {
		event.add(tag as any, "slimesurvival:entropy_attack" as any);
	});
});