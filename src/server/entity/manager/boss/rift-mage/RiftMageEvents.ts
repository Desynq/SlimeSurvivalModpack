

namespace RiftMageEvents {
	EntityEvents.spawned(event => {
		const entity = event.entity;
		if (!(entity instanceof $Arrow)) return;

		const owner = entity.owner;
		if (RiftMage.isCachedEntity(owner)) {
			entity.setBaseDamage(10.0);
			RiftMage.teleportAfterShootingBow(owner as any);
		}
	});

	function isRiftMageBullet(entity: unknown): entity is ShulkerBullet_ & Entity_ {
		return entity instanceof $ShulkerBullet && entity.tags.contains("rift_mage_bullet");
	}

	NativeEvents.onEvent($EntityTickEvent$Post, event => {
		const entity = event.entity;
		if (isRiftMageBullet(entity) && entity.isAlive() && entity.tickCount >= 300) {
			entity.level.explode(entity, entity.x, entity.y, entity.z, 4, false, "none");
			entity.discard();
		}
	});

	NativeEvents.onEvent($EntityInvulnerabilityCheckEvent, event => {
		const entity = event.entity;
		if (event.source.is($DamageTypeTags.IS_EXPLOSION as any) && isRiftMageBullet(entity)) {
			event.setInvulnerable(true);
		}
	});

	EntityEvents.afterHurt("minecraft:player" as any, event => {
		const player = event.entity as ServerPlayer_;
		const immediate = event.source.immediate;
		const attacker = event.source.actual;
		if (immediate instanceof $Arrow && RiftMage.isCachedEntity(attacker)) {
			LivingEntityHelper.addEffect(player, "cataclysm:stun", 20, 0, false, true, true, attacker);
			RiftMage.spawnShulkerBullets(attacker as any);
		}
	});
}