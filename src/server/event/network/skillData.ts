

abstract class EntityListPacket {
	protected readonly tag: CompoundTag_ = new $CompoundTag();

	public abstract update(entity: Entity_): void;

	protected add(entity: Entity_): void {
		this.tag.putBoolean(entity.stringUUID, true);
	}

	public remove(entity: Entity_): void {
		this.tag.remove(entity.stringUUID);
	}

	public getWithOverrides(replace: Record<string, boolean>): CompoundTag_ {
		const copy = this.tag.copy() as any as CompoundTag_;
		for (const [k, v] of Object.entries(replace)) {
			copy.putBoolean(k, v);
		}

		return copy;
	}

	public getSize(): number {
		return this.tag.size();
	}
}


class GlowingPacket {
	private readonly pinged: Set_<string> = new $HashSet();

	public update(entity: Entity_): void {
		if (!(entity instanceof $LivingEntity)) {
			this.remove(entity);
			return;
		}

		const pinged = LivingEntityHelper.hasEffect(entity, "slimesurvival:pinged");
		if (pinged) {
			this.add(entity);
		}
		else {
			this.remove(entity);
		}
	}

	private add(entity: Entity_): void {
		this.pinged.add(entity.stringUUID);
	}

	public remove(entity: Entity_): void {
		this.pinged.remove(entity.stringUUID);
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

	public getSize(): number {
		return this.pinged.size();
	}
}

class SculkerPacket extends EntityListPacket {

	public constructor() {
		super();
		this.tag.putBoolean("__inverted__", true);
	}

	public override update(entity: Entity_): void {
		const visible = this.isVisibleToSculker(entity);

		if (visible) {
			this.add(entity);
		}
		else {
			this.remove(entity);
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
}

namespace SkillNetwork {

	const glowingPacket = new GlowingPacket();
	const sculkerPacket = new SculkerPacket();

	EntityEventsExt.onTick(({ entity }) => {
		glowingPacket.update(entity);
		sculkerPacket.update(entity);
	});

	NativeEvents.onEvent($EntityLeaveLevelEvent, event => {
		try {
			glowingPacket.remove(event.entity);
			sculkerPacket.remove(event.entity);
		}
		catch (e) {
			console.error(e);
		}
	});

	ServerEvents.tick(event => {
		const server = event.server;

		const players = event.server.playerList.players.toArray() as ServerPlayer_[];

		const invisiblePlayersPacket = new $CompoundTag();
		for (const player of players) {
			invisiblePlayersPacket.putBoolean(player.stringUUID, isInvisiblePlayer(player));
		}

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