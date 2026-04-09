

namespace DamageTest {

	const msg = new ActionbarMessage({
		ticks: 40,
		priority: -1,
		id: null
	});

	const lastDamage = new EntityTimestamp<ServerPlayer_>("last_damage", 20);
	const totals = new $HashMap() as Map_<string, { total: number; }>;

	EntityEvents.afterHurt("minecraft:player", event => {
		const player = event.entity as ServerPlayer_;
		const damage = event.damage;
		const type = event.source.getType();

		const lastDmgTs = lastDamage.resolve(player);

		if (lastDmgTs.elapsed) {
			totals.remove(player.stringUUID); // reset
		}

		totals.putIfAbsent(player.stringUUID, { total: 0 });
		const store = totals.get(player.stringUUID);

		store.total += damage;

		msg.show(player,
			`${damage.toFixed(2)} (${store.total.toFixed(2)}) ${type}`
		);
		lastDmgTs.update();
	});
}