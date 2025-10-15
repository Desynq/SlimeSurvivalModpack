// priority: 2


class SoulFlareManager {
	private readonly flares: Record<string, SoulFlare[]> = {};

	/**
	 * @returns Array reference
	 */
	public getFlares(owner: LivingEntity_): SoulFlare[] {
		return this.flares[owner.stringUUID] ??= [];
	}

	public add(owner: LivingEntity_, flare: SoulFlare): void {
		this.getFlares(owner).push(flare);
	}

	public clear(owner: LivingEntity_): void {
		delete this.flares[owner.stringUUID];
	}
}