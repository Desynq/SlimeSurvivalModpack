


/**
 * A list of entities the sculker can see
 */
class SculkerPacket {
	private readonly tag: CompoundTag_;

	public constructor(server: MinecraftServer_) {
		this.tag = new $CompoundTag();
		this.tag.putBoolean("__inverted__", true);

		for (const entity of server.entities) {
			const visible = this.isVisibleToSculker(entity);
			// avoids polluting the packet with redundant false entries
			if (visible) {
				this.tag.putBoolean(entity.stringUUID, true);
			}
		}
	}

	private isVisibleToSculker(entity: Entity_): boolean {
		if (!(entity instanceof $LivingEntity)) return true;

		if (LivingEntityHelper.hasEffect(entity, "slimesurvival:pinged")) return true;

		if (this.isEntityGlowing(entity)) return true;

		return false;
	}

	private isEntityGlowing(entity: LivingEntity_): boolean {
		if (!entity.glowing) return false;

		const hasEffect = LivingEntityHelper.hasEffect(entity, "minecraft:glowing");

		// boss with default glow doesn't count
		if (!hasEffect && entity.tags.contains("boss.zeitgeist")) return false;

		return true;
	}

	public getWithOverrides(replace: Record<string, boolean>): CompoundTag_ {
		const copy = this.tag.copy() as any as CompoundTag_;
		for (const [k, v] of Object.entries(replace)) {
			copy.putBoolean(k, v);
		}

		return copy;
	}
}

class GlowingPacket {
	private readonly pinged = new Set<string>();

	public update(entity: Entity_): void {
		if (!(entity instanceof $LivingEntity)) {
			this.pinged.delete(entity.stringUUID);
			return;
		}

		const pinged = LivingEntityHelper.hasEffect(entity, "slimesurvival:pinged");
		if (pinged) {
			this.pinged.add(entity.stringUUID);
		}
		else {
			this.pinged.delete(entity.stringUUID);
		}
	}

	public remove(entity: Entity_): void {
		this.pinged.delete(entity.stringUUID);
	}

	public compile(player: ServerPlayer_): CompoundTag_ {
		const tag = new $CompoundTag();
		const hasLeer = SculkerSkills.LEER.isUnlockedFor(player);

		if (hasLeer) {
			this.pinged.forEach(uuid => {
				tag.putBoolean(uuid, true);
			});
		}

		return tag;
	}
}

namespace SkillNetwork {

	const glowingPacket = new GlowingPacket();

	EntityEventsExt.tick(({ entity }) => {
		glowingPacket.update(entity);
	});

	NativeEvents.onEvent($EntityLeaveLevelEvent, event => {
		glowingPacket.remove(event.entity);
	});

	ServerEvents.tick(event => {
		const server = event.server;
		const players = event.server.playerList.players.toArray() as ServerPlayer_[];

		const invisiblePlayersPacket = new $CompoundTag();
		for (const player of players) {
			invisiblePlayersPacket.putBoolean(player.stringUUID, isInvisiblePlayer(player));
		}

		const sculkerPacket = new SculkerPacket(server);

		for (const player of players) {
			let packet: CompoundTag_;

			const blind = SculkerSkills.BLIND.isUnlockedFor(player) && !player.creative && !player.spectator;
			if (blind) {
				packet = sculkerPacket.getWithOverrides({
					[player.stringUUID]: true // blind players can see themselves
				});
			}
			else {
				packet = invisiblePlayersPacket;
			}

			player.sendData("invisible_entities", packet);
			player.sendData("glowing_entities", glowingPacket.compile(player));
		}
	});

	function isInvisiblePlayer(player: ServerPlayer_): boolean {
		return InvisibleMan.isCachedEntity(player);
	}
}