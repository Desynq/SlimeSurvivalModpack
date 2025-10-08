
class EntropyHolder {
	private static readonly holders: Record<string, EntropyHolder> = {};

	public static get(entity: LivingEntity_): EntropyHolder | undefined {
		return EntropyHolder.holders[entity.stringUUID];
	};

	public static getOrCreate(entity: LivingEntity_) {
		let holder = EntropyHolder.get(entity);
		return holder !== undefined ? holder : new EntropyHolder(entity.stringUUID);
	};

	public static delete(entity: LivingEntity_): void {
		delete this.holders[entity.stringUUID];
	}

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

	public static getHoldersWithAttackerEntropy(attacker: LivingEntity_): EntropyHolder[] {
		const holders: EntropyHolder[] = [];
		Object.values(this.holders).forEach(holder => {
			if (holder.hasEntropyFrom(attacker)) {
				holders.push(holder);
			}
		});
		return holders;
	}



	public uuid: string;
	public entropyEntries: EntropyEntry[];

	public constructor(uuid: string) {
		this.uuid = uuid;
		this.entropyEntries = [];
		EntropyHolder.holders[uuid] = this;
	}


	public pushEntropyEntry(damage: float, attacker?: Entity_) {
		if (damage <= 0) {
			return;
		}
		this.entropyEntries.push(new EntropyEntry(
			damage,
			attacker != undefined ? attacker.stringUUID : undefined
		));
	};

	public getTotalEntropy() {
		return this.entropyEntries.reduce((sum, entry) => sum + entry.damage, 0);
	};

	public getTotalEntropyFrom(attacker: LivingEntity_): double {
		return this.entropyEntries
			.filter(entry => entry.isFrom(attacker))
			.reduce((sum, entry) => sum + entry.damage, 0);
	}

	public resetEntropy() {
		this.entropyEntries.length = 0;
	};

	public hasEntropyFrom(attacker: LivingEntity_): boolean {
		return attacker && this.entropyEntries.some(entry => entry.getAttacker(attacker.server) === attacker);
	}

	/**
	 * Transfers the attacker's entropy from this holder onto the target entity.
	 * Original holder loses the attacker's entropy as a result.
	 */
	public transferAttackerEntropy(attacker: LivingEntity_, target: LivingEntity_) {
		const targetHolder = EntropyHolder.getOrCreate(target);

		let transferredEntries: EntropyEntry[] = [];
		ListHelper.forEachRight(this.entropyEntries, (entry) => {
			if (!entry.isFrom(attacker)) return "continue";

			const clone = new EntropyEntry(entry.damage, entry.attackerUUID);
			transferredEntries.push(clone);
			targetHolder.entropyEntries.push(clone);
			return "splice";
		});
	}

	public removeEntriesFromAttacker(attacker: LivingEntity_): void {
		ListHelper.forEachRight(this.entropyEntries, entry => {
			if (entry.isFrom(attacker)) return "splice";
		});
	}


	/**
	 * Can mutate the entries list since it can possibly call EntityEvents.death() which may wipe the entries list as a part of its GC routine.
	 */
	private calculateAndDealDamage(entity: LivingEntity_, amount: float, entry: EntropyEntry) {
		if (entity.health <= 0) {
			return;
		}
		let uncertaintyDamage;
		let attacker = entry.getAttacker(entity.server);
		if (attacker) {
			if (!EntropyHelper.isFromQuantumAttacker(entity, attacker)) {
				uncertaintyDamage = Math.random() * 2 * amount;
			}
			else {
				let median = SkillHelper.hasSkill(attacker, FarlanderSkills.COHERENCE_1)
					? 1.5
					: 1.25;
				uncertaintyDamage = MathHelper.medianBiasedRandom(0, 2.0, median) * amount;
			}
		}
		else {
			uncertaintyDamage = Math.random() * 2 * amount;
		}

		this.dealDamage(entity, attacker as any, uncertaintyDamage);
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
		entity.health = 1.0; // arbitrary health so the player doesn't silently die
		const rk = $ResourceKey.create($Registries.DAMAGE_TYPE, "slimesurvival:entropy_kill");
		const entropyDmgType = entity.level.registryAccess().registryOrThrow($Registries.DAMAGE_TYPE).getHolderOrThrow(rk);
		entity.attack(new DamageSource(entropyDmgType, attacker as any, attacker as any), 2 ** 31 - 1);
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

	private tickEntries(owner: LivingEntity_) {
		ListHelper.forEachRight(this.entropyEntries, (entry, i, entries) => {
			if (entries.length === 0) return "break"; // handles reentrance if the player died from an entropy entry being ticked
			if (entry === undefined) return "break";
			if (!entry.tryTick(owner)) return "continue";

			const entropyDecay = this.decayEntry(owner, entry, i);
			this.calculateAndDealDamage(owner, entropyDecay, entry);
		});
	};

	private tryPlayFarlanderHurtSound(player: ServerPlayer_): void {
		if (!TickHelper.tryUpdateTimestamp(player, "last_entropy_hurt_sound_tick", 5)) {
			return;
		}

		playsound(player.level, player.position(), "minecraft:entity.enderman.hurt", "record", 1, 1.25);
	};

	private tryPlayFarlanderFullDecaySound(player: ServerPlayer_): void {
		playsound(player.level, player.position(), "minecraft:entity.enderman.death", "record", 1, 2);
	};

	private decayEntry(entity: LivingEntity_, entry: EntropyEntry, index: integer): number {
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