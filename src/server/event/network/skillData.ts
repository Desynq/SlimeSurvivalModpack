


namespace SkillNetwork {

	ServerEvents.tick(event => {
		const server = event.server;
		const players = event.server.playerList.players.toArray() as ServerPlayer_[];

		const invisiblePlayersPacket = new $CompoundTag();
		for (const player of players) {
			invisiblePlayersPacket.putBoolean(player.stringUUID, isInvisiblePlayer(player));
		}

		const sculkerPacket = createSculkerPacket(server);

		for (const player of players) {
			let packet: CompoundTag_;

			const blind = SculkerSkills.BLIND.isUnlockedFor(player) && !player.creative;
			if (blind) {
				// @ts-expect-error
				packet = sculkerPacket.copy();
				packet.putBoolean(player.stringUUID, true); // blind players should be able to see themselves
			}
			else {
				packet = invisiblePlayersPacket;
			}

			player.sendData("invisible_entities", packet);
		}
	});

	function isInvisiblePlayer(player: ServerPlayer_): boolean {
		return InvisibleMan.isCachedEntity(player);
	}

	function isVisibleToSculker(entity: Entity_): boolean {
		if (!(entity instanceof $LivingEntity)) return true;

		if (LivingEntityHelper.hasEffect(entity, "slimesurvival:pinged")) return true;

		if (isEntityGlowing(entity)) return true;

		return false;
	}

	function isEntityGlowing(entity: LivingEntity_): boolean {
		if (!entity.glowing) return false;

		const hasEffect = LivingEntityHelper.hasEffect(entity, "mincraft:glowing");

		// boss with default glow doesn't count
		if (!hasEffect && entity.tags.contains("boss.zeitgeist")) return false;

		return true;
	}

	function createSculkerPacket(server: MinecraftServer_): CompoundTag_ {
		const visibileEntities = server.entities.filter(isVisibleToSculker as any).toArray() as LivingEntity_[];

		const packet = new $CompoundTag();
		packet.putBoolean("__inverted__", true);

		for (const entity of visibileEntities) {
			packet.putBoolean(entity.stringUUID, true);
		}

		return packet;
	}
}