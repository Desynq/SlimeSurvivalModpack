interface EntropyEntry {
	damage: number;
	uuid?: string;
}

class EntropyHolder {
	public static readonly holders: Record<string, EntropyHolder> = {};

	public static get(entity: LivingEntity_): EntropyHolder | undefined {
		return EntropyHolder.holders[entity.stringUUID];
	};

	public static getOrCreate(entity: LivingEntity_) {
		let holder = EntropyHolder.get(entity);
		return holder !== undefined ? holder : new EntropyHolder(entity.stringUUID);
	};

	public static tick(entity: LivingEntity_, createNew: boolean) {
		let holder = EntropyHolder.get(entity);
		if (holder === undefined && !createNew) {
			return;
		}
		if (holder === undefined) {
			holder = new EntropyHolder(entity.stringUUID);
		}
		holder.tick(entity);
	};



	public uuid: string;
	public entropyEntries: EntropyEntry[];

	public constructor(uuid: string) {
		this.uuid = uuid;
		this.entropyEntries = [];
		EntropyHolder.holders[uuid] = this;
	}


	public pushEntropyEntry(damage: float, attacker: Entity) {
		if (damage <= 0) {
			return;
		}
		this.entropyEntries.push({
			damage: damage,
			uuid: attacker != undefined ? attacker.stringUUID : undefined
		});
	};

	public getTotalEntropy() {
		return this.entropyEntries.reduce((sum, entry) => sum + entry.damage, 0);
	};

	public resetEntropy() {
		this.entropyEntries.length = 0;
	};


	private calculateAndDealDamage(entity: LivingEntity_, amount: float, entry: EntropyEntry) {
		if (entity.health <= 0) {
			return;
		}
		let uncertaintyDamage;
		let attacker = entry.uuid == undefined ? null : entity.server.getEntityByUUID(entry.uuid);
		if (attacker != null) {
			if (!EntropyHelper.isFromQuantumAttacker(entity, attacker)) {
				uncertaintyDamage = Math.random() * 2 * amount;
			}
			else {
				uncertaintyDamage = MathHelper.medianBiasedRandom(0, 2.0, 1.25) * amount;
			}
		}
		else {
			uncertaintyDamage = Math.random() * 2 * amount;
		}

		// @ts-ignore
		this.dealDamage(entity, attacker, uncertaintyDamage);
	};

	private dealDamage(entity: LivingEntity_, attacker: LivingEntity_ | null, amount: float) {
		try {
			entity.health -= amount;
			EntropyHelper.incrementLifetimeEntropyDamage(entity, amount);
			if (entity.health <= 0) this.executeEntropyKill(entity, attacker);
		}
		catch (error) {
			tellError(entity.server, error);
		}
	};

	private executeEntropyKill(entity: LivingEntity_, attacker: LivingEntity_ | null) {
		entity.health = 0.0001;
		let reg = entity.level.registryAccess().registryOrThrow($Registries.DAMAGE_TYPE).getHolderOrThrow($ResourceKey.create($Registries.DAMAGE_TYPE, "slimesurvival:entropy"));
		// @ts-ignore
		entity.attack(new DamageSource(reg, attacker, attacker), 1.0);
	}

	public tick(holder: LivingEntity_) {
		let player = holder instanceof $Player ? holder : null;
		if (player != null) {
			let entropyDisplay = `{"color":"dark_purple","text":"Entropy: ${this.getTotalEntropy().toFixed(2)}"}`;
			ActionbarManager.addText(player, entropyDisplay);
		}

		if (this.entropyEntries.length <= 0) {
			return;
		}

		let entropyInterval = EntropyHelper.getInterval(holder);
		if (TickHelper.getGameTime(holder.server) - holder.persistentData.getLong("last_entropy_tick") < entropyInterval) {
			return;
		}

		this.tickEntries(holder);

		CommandHelper.runCommandSilent(holder.server,
			`execute in ${holder.level.dimension.toString()} positioned ${holder.x} ${holder.y} ${holder.z} run particle minecraft:soul ~ ~${holder.eyeHeight * 0.5} ~ 0.3 0.3 0.3 0.1 1 force @a[distance=..64]`
		);

		if (holder instanceof $ServerPlayer && EntropyHelper.isFarlander(holder)) {
			this.tryPlayFarlanderHurtSound(holder);
			if (this.entropyEntries.length <= 0) {
				this.tryPlayFarlanderFullDecaySound(holder);
			}
		}

		holder.persistentData.putLong("last_entropy_tick", TickHelper.getGameTime(holder.server));
	};

	private tickEntries(holder: LivingEntity_) {
		// walk backwards to avoid skipping entries when splicing off entries
		for (let i = this.entropyEntries.length - 1; i >= 0; i--) {
			let entry = this.entropyEntries[i];
			let entropyDecay = this.decayEntry(holder, entry, i);
			this.calculateAndDealDamage(holder, entropyDecay, entry);
		}
	};

	private tryPlayFarlanderHurtSound(player: ServerPlayer_) {
		if (!TickHelper.tryUpdateTimestamp(player, "last_entropy_hurt_sound_tick", 5)) {
			return;
		}

		playsound(player.level, player.position(), "minecraft:entity.enderman.hurt", "record", 1, 1.25);
	};

	private tryPlayFarlanderFullDecaySound(player: ServerPlayer_) {
		playsound(player.level, player.position(), "minecraft:entity.enderman.death", "record", 1, 2);
	};

	private decayEntry(entity: LivingEntity_, entry: EntropyEntry, index: integer) {
		if (entry.damage > 0.5) {
			let entropyDecay = entry.damage * EntropyHelper.getDecayPercentage(entity);
			entry.damage -= entropyDecay;
			return entropyDecay;
		}
		else {
			let entropyDecay = entry.damage;
			this.entropyEntries.splice(index, 1);
			return entropyDecay;
		}
	};
}