


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
			if (SculkerSkills.BLIND.isUnlockedFor(player)) {
				packet = sculkerPacket.copy();
				packet.putBoolean(player.stringUUID, true); // sculker should be able to see themselves
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

	function createSculkerPacket(server: MinecraftServer_): CompoundTag_ {
		const isVisible = (entity: LivingEntity_) => entity instanceof $LivingEntity && (
			LivingEntityHelper.hasEffect(entity, "slimesurvival:pinged")
			|| entity.glowing
		);

		const visibileEntities = server.entities.filter(isVisible as any).toArray() as LivingEntity_[];

		const packet = new $CompoundTag();
		packet.putBoolean("__inverted__", true);

		for (const entity of visibileEntities) {
			packet.putBoolean(entity.stringUUID, true);
		}

		return packet;
	}
}