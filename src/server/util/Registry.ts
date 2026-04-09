// priority: 1000



class UUIDRegistry<T extends object> {

	protected readonly map = new Map<string, T>();

	public constructor(
		protected readonly create: (key: string) => T
	) { }

	public getOrCreate(key: string): T {
		key += "";

		let value = this.map.get(key);
		if (value === undefined) {
			value = this.create(key);
			this.map.set(key, value);
		}

		return value;
	}
}