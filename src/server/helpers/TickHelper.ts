// priority: 1000


class TickHelper {

	// TODO: make this get actual server tick rate
	public static getDefaultTickRate(server: MinecraftServer_) {
		return 20;
	};

	public static defaultTickRate = 20;

	public static setTickRate(server: MinecraftServer_, newTickRate: integer) {
		CommandHelper.runCommandSilent(server, `tick rate ${newTickRate}`);
	};

	public static resetTickRate(server: MinecraftServer_) {
		CommandHelper.runCommandSilent(server, `tick rate ${TickHelper.getDefaultTickRate(server)}`);
	};

	public static getGameTime(server: MinecraftServer_) {
		return server.overworld().levelData.getGameTime();
	};



	/**
	 * @returns `0` if timestamp has not been set for entity
	 */
	public static getTimestamp(entity: Entity_, id: string) {
		return entity.persistentData.getLong(id);
	};

	public static hasTimestamp(entity: Entity_, id: string) {
		return entity.persistentData.contains(id);
	};

	/**
	 * @returns Time that has passed since the timestamp was last set or the current game time if the timestamp has not been updated.
	 */
	public static getTimestampDiff(entity: Entity_, id: string): long {
		return TickHelper.getGameTime(entity.server) - TickHelper.getTimestamp(entity, id);
	};

	public static hasTimestampElapsed(entity: Entity_, id: string, interval: long) {
		return TickHelper.getTimestampDiff(entity, id) >= interval;
	};

	public static getTimestampRemaining(entity: Entity_, id: string, interval: long) {
		return interval - TickHelper.getTimestampDiff(entity, id);
	};

	public static hasTimestampJustElapsed(entity: Entity_, id: string, interval: long) {
		return TickHelper.getTimestampDiff(entity, id) === interval;
	};

	/**
	 * Sets the timestamp to the current game time
	 */
	public static forceUpdateTimestamp(entity: Entity_, id: string) {
		entity.persistentData.putLong(id, TickHelper.getGameTime(entity.server));
	};

	/**
	 * Sets the timestamp `time` ticks before the current game time
	 */
	public static setTimestampBefore(entity: Entity_, id: string, time: long) {
		entity.persistentData.putLong(id, TickHelper.getGameTime(entity.server) - time);
	};

	/**
	 * Sets the timestamp `time` ticks after the current game time
	 */
	public static setTimestampAfter(entity: Entity_, id: string, time: long) {
		entity.persistentData.putLong(id, TickHelper.getGameTime(entity.server) + time);
	};

	/**
	 * Sets timestamp to Long.MIN_VALUE so that hasTimestampPassed() always returns true
	 */
	public static resetTimestamp(entity: Entity_, id: string) {
		entity.persistentData.putLong(id, $Long.MIN_VALUE);
	};

	/**
	 * 
	 * @param {Entity_} entity 
	 * @param {string} id 
	 */
	public static removeTimestamp(entity: Entity_, id: string) {
		entity.persistentData.remove(id);
	};

	/**
	 * Updates the timestamp to current game time if it has elapsed
	 * @returns `true` if timestamp was successfully updated after elapsing
	 */
	public static tryUpdateTimestamp(entity: Entity_, id: string, interval: long): boolean {
		if (TickHelper.hasTimestampElapsed(entity, id, interval)) {
			TickHelper.forceUpdateTimestamp(entity, id);
			return true;
		}
		return false;
	};

	/**
	 * @param digits defaults to `1`
	 */
	public static toSeconds(server: MinecraftServer_, ticks: integer, digits: integer = 1) {
		return (ticks / TickHelper.getDefaultTickRate(server)).toFixed(digits);
	};
}