// priority: 1

/** In case something goes horribly wrong, call this using `/eval "nukeBossbars(source.server)"`.
 * 
 */
function nukeBossbars(server: MinecraftServer_) {
	const bossEvents = server.getCustomBossEvents();
	for (const event of bossEvents.getEvents().toArray() as CustomBossEvent_[]) {
		event.removeAllPlayers();
		bossEvents.remove(event);
	}
}

const EntityManagers = new EntityManagerRegistry();

interface ITickableBoss<T extends LivingEntity_> {
	/**
	 * Called every tick for the entity if it's alive
	 */
	onBossTick(boss: T): void;
}

interface ICustomBossbar<T extends LivingEntity_> {
	onBossbarUpdate(boss: T): void;
}



ServerEvents.tick(event => {
	EntityDirector.pruneBossbars(event.server);
	EntityDirector.tickAll(event.server);
});



EntityEvents.spawned(event => {
	EntityDirector.eventHook(event.entity, event);
});

EntityEvents.death(event => {
	const victim = event.entity;
	EntityDirector.eventHook(victim, event);

	if (victim instanceof $ServerPlayer) {
		for (const manager of EntityDirector.managers) {
			if (manager.hasEntity()) {
				manager.onGlobalPlayerDeath(victim, event);
			}
		}
	}

	const attacker = event.source.actual;
	if (victim instanceof $LivingEntity && attacker) {
		for (const manager of EntityManagers.getManagers(attacker)) {
			manager.onKill(attacker, victim, event);
		}
	}
});

EntityEvents.afterHurt(event => {
	const entity = event.entity;
	for (const manager of EntityManagers.getManagers(entity)) {
		manager.onAfterHurt(entity, event);
	}
});




NativeEvents.onEvent($EntityJoinLevelEvent, event => {
	for (const manager of EntityDirector.managers) {
		if (manager.isEntity(event.entity)) {
			manager.onJoin(event.entity, event);
			break;
		}
	}
});

NativeEvents.onEvent($EntityLeaveLevelEvent, event => {
	EntityDirector.eventHook(event.entity, event);
});

NativeEvents.onEvent($LivingIncomingDamageEvent, event => {
	EntityDirector.eventHook(event.entity, event);
});

NativeEvents.onEvent($EntityMountEvent, event => {
	const mounter = event.getEntityMounting();
	EntityDirector.eventHook(mounter, event);
});



NativeEvents.onEvent($EntityTickEvent$Post, event => {
	const entity = event.entity;
	if (EntityManager.isGenericBoss(entity)) {
		EntityDirector.genericBossTick(entity);
	}
});