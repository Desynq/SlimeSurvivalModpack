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

const BossManagerRegistry = new EntityManagerRegistry();

interface ITickableBoss<T> {
	onBossTick(boss: T): void;
}

interface ICustomBossbar<T> {
	onBossbarUpdate(boss: T): void;
}



ServerEvents.tick(event => {
	BossDirector.pruneBossbars(event.server);
	BossDirector.tickAll(event.server);
});



EntityEvents.spawned(event => {
	BossDirector.eventHook(event.entity, event);
});

EntityEvents.death(event => {
	const victim = event.entity;
	BossDirector.eventHook(victim, event);

	if (victim instanceof $ServerPlayer) {
		for (const manager of BossDirector.managers) {
			if (manager.hasBoss()) {
				manager.onPlayerDeath(victim, event);
			}
		}
	}

	const attacker = event.source.actual;
	if (attacker) {
		BossManagerRegistry.getManager(attacker)?.onKill(attacker, victim, event);
	}
});

NativeEvents.onEvent($EntityJoinLevelEvent, event => {
	for (const manager of BossDirector.managers) {
		if (manager.isBoss(event.entity)) {
			manager.onJoin(event.entity, event);
			break;
		}
	}
});

NativeEvents.onEvent($EntityLeaveLevelEvent, event => {
	BossDirector.eventHook(event.entity, event);
});

NativeEvents.onEvent($LivingIncomingDamageEvent, event => {
	BossDirector.eventHook(event.entity, event);
});



NativeEvents.onEvent($EntityTickEvent$Post, event => {
	const entity = event.entity;
	if (BossManager.isGenericBoss(entity)) {
		BossDirector.genericBossTick(entity);
	}
});