// priority: 2

class ManagedBooleanGamerule {
	private currentSetting: boolean;

	public constructor(
		public readonly gameruleId: string,
		public readonly defaultSetting: boolean
	) {
		this.currentSetting = defaultSetting;
	}
}

class GameruleManager {
}