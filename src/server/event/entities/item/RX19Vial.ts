


const RX25Vial = new (class {

	public isItem(entity: ItemEntity_): boolean {
		return StackHelper.isCustomItem(entity.getItem(), "rx25_vial");
	}

	public tick(entity: ItemEntity_): void {
		if (!this.isItem(entity)) return;

		entity.setPickupDelay(-1);

		if (!entity.onGround()) return;

		CommandHelper.runCommandSilent(entity.level,
			`particle ash ${entity.x} ${entity.y + 0.5} ${entity.z} 1 1 1 1 100 force @a`
		);
		playsound(entity.level, entity.position(), "block.glass.break", "master", 2, 1);

		const players = EntityHelper.getNearbySurvivors(entity as any, 2);
		players.forEach(player => {
			player.tags.add("disease.rx25");
		});

		entity.discard();
	}
})();