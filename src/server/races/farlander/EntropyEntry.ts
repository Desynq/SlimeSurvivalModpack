
class EntropyEntry {
	private lastTicked: long = -Number.MAX_VALUE;

	public constructor(
		private _damage: number,
		private _attackerUUID?: string
	) { }

	public get damage(): number {
		return this._damage;
	}

	public set damage(amount: number) {
		this._damage = amount;
	}

	public get attackerUUID(): string | undefined {
		return this._attackerUUID;
	}

	public getAttacker(server: MinecraftServer_): Entity_ | null {
		if (!this.attackerUUID) return null;
		return server.getEntityByUUID(this.attackerUUID);
	}

	public isFrom(entity: LivingEntity_): boolean {
		const attacker = this.getAttacker(entity.server);
		return attacker !== null && attacker === entity;
	}

	public getInterval(owner: LivingEntity_): integer {
		const attacker = this.getAttacker(owner.server);

		let base = EntropyHelper.getInterval(owner);
		if (SkillHelper.hasSkill(attacker, FarlanderSkills.COHERENCE_1)) {
			base += 4;
		}
		return base;
	}

	public canTick(owner: LivingEntity_): boolean {
		return TickHelper.getGameTime(owner.server) - this.lastTicked >= this.getInterval(owner);
	}

	public tryTick(owner: LivingEntity_): boolean {
		if (this.canTick(owner)) {
			this.lastTicked = TickHelper.getGameTime(owner.server);
			return true;
		}
		return false;
	}
}